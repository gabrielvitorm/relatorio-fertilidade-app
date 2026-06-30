# Mapa da Fertilidade — Gerador de Relatório em PDF

App Next.js que recebe as respostas do questionário (via webhook, chamado
pelo n8n) e devolve um PDF personalizado e diagramado, com textos
pré-definidos (sem custo de IA) e indicadores de risco específicos que
aparecem independentemente do nível geral de fertilidade.

## 1. Auditoria do fluxo Typebot original

Antes de portar a lógica, estudei o JSON exportado (`typebot-export-mapa-da-fertilidade__1_.json`)
e encontrei 2 inconsistências reais no fluxo em produção. Documentando aqui
porque elas mudam números que provavelmente já estão na sua planilha do
Google Sheets:

**a) "Atividade Física" nunca funcionou de verdade.**
A fórmula da categoria é `(soma das 3 perguntas) * peso4_atividade_score`,
mas a variável `peso4_atividade_score` nunca tem um bloco "Set variable"
em nenhum lugar do fluxo (busquei no JSON inteiro — ela aparece uma única
vez, exatamente nessa fórmula). Ou seja, esse pilar provavelmente sempre
retornou `0` ou `NaN`, não importa o que a pessoa respondesse sobre
exercício físico.

**b) 4 categorias tinham o "máximo" de pontos incoerente com o peso real.**
Cada categoria tem uma função tipo:
```js
const max = 18; // valor fixo, "chutado" no código
if (score/max >= 0.8) return 'Alto';
```
Mas o `max` correto deveria ser `peso × nº de perguntas × 3`. Em 3 categorias
o valor fixo estava ALTO demais, tornando o nível **Alto impossível de
alcançar** mesmo com todas as respostas perfeitas:

| Categoria | `max` fixo no código | `max` real (peso × perguntas) | Resultado prático |
|---|---|---|---|
| Imunidade | 24 | 18 | "Alto" inatingível (18/24 = 75%, abaixo dos 80% exigidos) |
| Tireoide | 9 | 6 | "Alto" inatingível (6/9 = 67%) |
| Toxinas | 6 | 3 | nem "Moderado" é atingível (3/6 = 50%, abaixo dos 60%) |
| Fígado | 18 | 24 | o oposto: fica fácil demais alcançar "Alto" |

**A boa notícia:** somando peso × perguntas das 13 categorias *com essas
correções*, o total dá **exatamente 285** — o mesmo divisor que o Typebot
já usa em `resultado_final = score_total / 285 * 100`. Isso é um indício
forte de que 285 era o número certo desde o início, e só os pesos/máximos
individuais é que se perderam ao longo das edições do fluxo. Por isso o
percentual GERAL do seu Typebot atual provavelmente está certo — o
problema está só na classificação *por categoria* (Alto/Moderado/Baixo de
cada pilar) e na pontuação bruta da Atividade Física.

Neste projeto, `lib/pesos.ts` já nasce com os pesos corretos e calcula o
máximo de cada categoria **dinamicamente** (nunca mais hardcoded), então
esse tipo de bug não pode voltar a acontecer. Se você preferir replicar o
comportamento atual do Typebot (bugs incluídos) por consistência histórica
com dados já coletados, é só me avisar — dá pra colocar uma flag de
"modo legado".

## 2. O mecanismo de indicador de risco (seu exemplo do SOP)

A pontuação por categoria é uma **média** das respostas daquele pilar.
Isso é estatisticamente correto, mas pode "diluir" uma resposta grave (ex:
SOP confirmada) entre várias respostas boas — e o pilar inteiro fecha como
Alto mesmo assim.

Por isso, em paralelo ao cálculo por categoria, existe `lib/risco/regras.ts`:
uma tabela de regras simples (`se resposta X = valor crítico, dispara
indicador Y`) avaliada sobre as **respostas brutas**, não sobre a nota da
categoria. O resultado vira uma seção própria no PDF — "Pontos de Atenção
Específicos" — que aparece **mesmo quando a classificação geral é Alta**.

Testei exatamente o seu cenário: todas as respostas perfeitas, exceto SOP
confirmada. Resultado: classificação geral **Alta (97%)**, mas o PDF
mostra um alerta específico de SOP na primeira página. Os dois PDFs de
exemplo gerados estão em `examples/`.

Pra adicionar uma nova regra (outra condição, outro pilar), é só copiar um
item do array em `regras.ts` — não precisa mexer no motor de cálculo.

## 3. Arquitetura

```
Typebot (questionário)
   → n8n (lê o resultado, traduz para o nosso payload)
       → POST /api/relatorio  (Next.js, hospedado na sua VPS Hostinger)
           → calcula categorias + indicadores de risco (puro, sem IA)
           → renderiza o PDF (@react-pdf/renderer)
           → devolve o PDF (binário) na resposta
       ← n8n recebe o PDF
           → envia por e-mail (anexo)
           → envia por WhatsApp (anexo/mídia)
```

Por que `@react-pdf/renderer` em vez de Puppeteer/HTML+CSS: ele não
depende de um Chromium rodando na VPS (menos RAM, menos coisa pra
quebrar em produção), gera o PDF em memória em <1s, e o layout por
componentes (`RelatorioDocument.tsx`) fica fácil de evoluir. A
desvantagem é que fontes/emoji coloridos não funcionam nas fontes padrão
do PDF — por isso o relatório usa selos de cor em vez de emoji (ver
`lib/pdf/sem-emoji.ts` pra entender a decisão).

## 4. Estrutura visual do relatório

O PDF segue uma narrativa, não uma lista solta de 13 blocos de texto:

1. **Capa** — selo da marca, nome, data, e um gauge circular grande com o
   percentual geral (a primeira coisa que a pessoa vê é "94%", não um parágrafo).
2. **Visão geral** — gráfico de barras horizontais com as 13 categorias
   ranqueadas da que mais precisa de atenção pra que já está consolidada.
   É o "mapa do mapa": dá pra entender o relatório inteiro olhando só essa página.
3. **Pontos de atenção específicos** (só aparece se houver algum) — os
   alertas tipo SOP, em destaque, com ícone e selo ALERTA/ATENÇÃO.
4. **Detalhamento por pilar** — as 13 categorias agrupadas em 3 temas
   (Fatores Clínicos, Estilo de Vida, Corpo e Equilíbrio Interno), cada uma
   com ícone próprio, em grid de 2 colunas — não é mais uma lista vertical
   de 13 cards idênticos.
5. **Plano de ação** — síntese numerada e priorizada (risco clínico
   primeiro, depois os pilares mais fracos), pra fechar o relatório com um
   "e agora, o que eu faço" em vez de só repetir os cards anteriores.

Os ícones de cada categoria (`lib/pdf/icons.tsx`) são desenhados em SVG
"na mão" — nem emoji nem fontes de ícone funcionam de forma confiável
dentro de fontes padrão de PDF (ver `lib/pdf/sem-emoji.ts`), então optei
por um conjunto monoline simples e consistente. O agrupamento temático
fica em `lib/conteudo/grupos.ts` e o plano de ação consolidado em
`lib/plano-de-acao.ts` — ambos fáceis de ajustar sem mexer no motor de
cálculo.

## 5. Contrato do webhook

```
POST /api/relatorio
Header: x-api-key: <RELATORIO_API_KEY>
Content-Type: application/json
```

Corpo (ver `lib/types.ts` para o schema Zod completo):

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "+5511999999999",
  "referencia": "id-do-resultado-no-typebot",
  "respostas": {
    "idade": 3, "endometriose": 3, "sop": 0, "celiaca": 3,
    "autoimune_geral": 3, "obstrucao_tubaria": 3, "obesidade": 3, "magreza": 3,
    "fsh": 3, "amh": 3, "foliculos_antrais": 3, "progesterona": 3,
    "horas_sono": 3, "profundidade_sono": 3, "sonha_muito": 3, "dificuldade_dormir": 3,
    "frequencia_exercicio": 3, "treino_equilibrado": 3, "sedentarismo": 3,
    "ultraprocessados": 3, "fibras_frutas_vegetais": 3, "proteinas_qualidade": 3,
    "frequencia_evacuacao": 3, "gases_inchaco": 3, "disbiose_antibiotico": 3,
    "esteatose_hepatica": 3, "uso_medicamentos": 3, "cor_lingua": 3, "sintomas_tpm_acne": 3,
    "frequencia_infeccoes": 3, "doencas_autoimunes_grau": 3, "marcadores_inflamatorios": 3,
    "estresse_diario": 3, "exaustao": 3, "ansiedade_insonia": 3,
    "ciclo_regular": 3, "ovulacao": 3, "fluxo_menstrual": 3,
    "tsh": 3, "exposicao_toxinas": 3, "historico_familiar": 3
  }
}
```

**Resposta:** PDF binário (`Content-Type: application/pdf`). No n8n, o
node de HTTP Request com "Response Format: File" já entrega isso pronto
para o node de Email/WhatsApp como anexo — não precisa de um passo
intermediário de upload.

> Se no futuro você preferir um link em vez de anexo (por exemplo, pra
> WhatsApp via Cloud API oficial, que às vezes prefere URL pública), é uma
> mudança pequena: subir o buffer pro Cloudflare R2 que vocês já usam no
> Mapa da Fertilidade e devolver a URL em JSON em vez do binário.

## 6. Mapeamento Typebot → payload (para montar o node do n8n)

O Typebot já calcula o valor numérico (0–3) de cada resposta na própria
variável (ex: `pergunta3_peso1` = 0, 1 ou 3, conforme a opção escolhida).
O n8n só precisa pegar o resultado do Typebot (via API de resultados ou
via a planilha do Google Sheets) e remontar nesse formato:

| Variável no Typebot | Campo no payload | Pergunta |
|---|---|---|
| `nome_verificado` | `nome` | — |
| `email_verificado` | `email` | — |
| `celular_verificado` | `telefone` | — |
| `pergunta1_peso1` | `idade` | Qual sua idade? |
| `pergunta2_peso1` | `endometriose` | Diagnóstico de endometriose? |
| `pergunta3_peso1` | `sop` | Diagnóstico de SOP? |
| `pergunta4_peso1` | `celiaca` | Doença celíaca/glúten? |
| `pergunta5_peso1` | `autoimune_geral` | Doença autoimune (Hashimoto, Lúpus)? |
| `pergunta6_peso1` | `obstrucao_tubaria` | Obstrução tubária? |
| `pergunta7_peso1` | `obesidade` | Obesidade (IMC ≥ 30)? |
| `pergunta8_peso1` | `magreza` | Magreza severa (IMC < 18,5)? |
| `pergunta1_peso2` | `fsh` | FSH |
| `pergunta2_peso2` | `amh` | AMH |
| `pergunta3_peso2` | `foliculos_antrais` | Folículos antrais |
| `pergunta4_peso2` | `progesterona` | Progesterona fase lútea |
| `pergunta1_peso3` | `horas_sono` | Horas de sono |
| `pergunta2_peso3` | `profundidade_sono` | Sono leve/pesado |
| `pergunta3_peso3` | `sonha_muito` | Sonha muito |
| `pergunta4_peso3` | `dificuldade_dormir` | Dificuldade pra dormir |
| `pergunta1_peso4` | `frequencia_exercicio` | Frequência de exercício |
| `pergunta2_peso4` | `treino_equilibrado` | Treino equilibrado |
| `pergunta3_peso4` | `sedentarismo` | Sedentarismo |
| `pergunta1_peso5` | `ultraprocessados` | Consumo de ultraprocessados |
| `pergunta2_peso5` | `fibras_frutas_vegetais` | Fibras/frutas/vegetais |
| `pergunta3_peso5` | `proteinas_qualidade` | Proteínas de qualidade |
| `pergunta1_peso6` | `frequencia_evacuacao` | Frequência de evacuação |
| `pergunta2_peso6` | `gases_inchaco` | Gases/inchaço |
| `pergunta3_peso6` | `disbiose_antibiotico` | Disbiose/antibiótico |
| `pergunta1_peso7` | `esteatose_hepatica` | Esteatose hepática |
| `pergunta2_peso7` | `uso_medicamentos` | Uso de medicamentos |
| `pergunta3_peso7` | `cor_lingua` | Cor da língua |
| `pergunta4_peso7` | `sintomas_tpm_acne` | TPM/acne/enxaqueca/candidíase |
| `pergunta1_peso8` | `frequencia_infeccoes` | Frequência de infecções |
| `pergunta2_peso8` | `doencas_autoimunes_grau` | Doenças autoimunes (grau) |
| `pergunta3_peso8` | `marcadores_inflamatorios` | Marcadores inflamatórios |
| `pergunta1_peso9` | `estresse_diario` | Estresse diário |
| `pergunta2_peso9` | `exaustao` | Exaustão física/mental |
| `pergunta3_peso9` | `ansiedade_insonia` | Ansiedade/insônia |
| `pergunta1_peso10` | `ciclo_regular` | Ciclo regular |
| `pergunta2_peso10` | `ovulacao` | Ovulação confirmada |
| `pergunta3_peso10` | `fluxo_menstrual` | Fluxo menstrual |
| `pergunta1_peso11` | `tsh` | TSH |
| `pergunta1_peso12` | `exposicao_toxinas` | Exposição a toxinas |
| `pergunta1_peso13` | `historico_familiar` | Histórico familiar |

No n8n, isso vira um node "Code" (JavaScript) ou "Set" simples fazendo
esse de-para antes do HTTP Request para o nosso `/api/relatorio`.

> Atenção a um caso especial: a pergunta de Progesterona (`pergunta4_peso2`)
> tem uma opção "não sei" sem `value` definido no Typebot (vem `null`/
> `undefined`). No node do n8n, trate isso como `0` antes de enviar.

## 7. Rodando localmente

```bash
npm install
echo "RELATORIO_API_KEY=defina-uma-chave-forte" > .env.local
npm run dev
```

Testar sem precisar do n8n:
```bash
curl -X POST http://localhost:3000/api/relatorio \
  -H "x-api-key: defina-uma-chave-forte" \
  -H "Content-Type: application/json" \
  -d @examples/payload-sop-com-resto-bom.json \
  --output relatorio.pdf
```

Testar só o motor de cálculo (sem subir o servidor):
```bash
npm run test:scoring
```

## 8. Deploy

Mesmo padrão que vocês já usam no Mapa da Fertilidade (VPS Hostinger):
`next build` + `next start` atrás do Nginx/Cloudflare, com
`RELATORIO_API_KEY` como variável de ambiente no servidor. Não precisa de
banco de dados — o app é *stateless*: recebe respostas, devolve PDF, não
guarda nada (quem guarda histórico é a planilha/Typebot, como já é hoje).

## 9. Próximos passos sugeridos

1. Validar comigo (ou com uma nutricionista/médica de confiança) os textos
   das `REGRAS_RISCO` em `lib/risco/regras.ts` — copiei o tom do que já
   existia no Typebot, mas o conteúdo clínico merece uma revisão de
   alguém da área antes de ir pra produção.
2. Decidir: manter os bugs do Typebot original por consistência histórica,
   ou seguir com os pesos corrigidos (recomendo a correção, mas a decisão
   é sua).
3. Trocar o `x-api-key` simples por algo mais robusto se este endpoint for
   ficar exposto publicamente (ex: validar também a origem do n8n, ou
   IP allowlist no Nginx).
4. Se quiser anexar o PDF também na própria planilha/CRM, dá pra fazer o
   n8n salvar o PDF retornado direto no Google Drive antes de enviar.
# relatorio-fertilidade-app
