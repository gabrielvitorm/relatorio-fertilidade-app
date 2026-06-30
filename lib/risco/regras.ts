import { CategoriaId, Respostas } from "../types";

/**
 * O CORAÇÃO do que você pediu: "se ela tem fertilidade moderada/alta mas
 * tem SOP, isso é um indicativo de risco".
 *
 * A pontuação por categoria é uma MÉDIA das respostas daquele pilar — então
 * uma resposta grave (SOP confirmada) pode ficar "diluída" entre outras
 * respostas boas e o pilar inteiro ainda fechar como Moderado ou até Alto.
 * Isso é estatisticamente correto, mas clinicamente perigoso: a pessoa que
 * mais precisa ver o alerta sobre SOP é justamente quem, no resto, vai bem.
 *
 * Por isso essas regras são avaliadas em cima das RESPOSTAS BRUTAS, não da
 * nota da categoria, e aparecem no PDF numa seção própria ("Pontos de
 * Atenção Específicos") que existe INDEPENDENTE do nível geral do
 * relatório. Uma pessoa com fertilidade Alta pode e deve ver essa seção se
 * ela marcou "Sim" para SOP.
 *
 * Para adicionar uma nova regra: copie um item do array, troque a chave da
 * resposta, o valor-gatilho e os textos. Nada de IA, nada de cálculo
 * exótico — é uma tabela de condições simples, fácil de auditar e de
 * revisar com calma (ou até com um médico/nutricionista, se quiser validar
 * o conteúdo clínico antes de publicar).
 */
export interface RegraRisco {
  id: string;
  categoriaId: CategoriaId;
  titulo: string;
  /** Recebe as respostas brutas e diz se a regra "disparou" */
  condicao: (r: Respostas) => boolean;
  mensagem: string;
  severidade: "atencao" | "alerta";
}

export const REGRAS_RISCO: RegraRisco[] = [
  {
    id: "sop",
    categoriaId: "fatores_infertilidade",
    titulo: "SOP (Síndrome dos Ovários Policísticos)",
    condicao: (r) => r.sop <= 1, // 1 = suspeita, 0 = confirmada
    mensagem:
      "Você indicou suspeita ou diagnóstico confirmado de SOP. A SOP pode interferir diretamente na ovulação mesmo quando outros marcadores de fertilidade estão bons — vale priorizar acompanhamento com ginecologista/endocrinologista especializado, independentemente do seu resultado geral.",
    severidade: "alerta",
  },
  {
    id: "endometriose",
    categoriaId: "fatores_infertilidade",
    titulo: "Endometriose",
    condicao: (r) => r.endometriose <= 1,
    mensagem:
      "Você indicou suspeita ou diagnóstico confirmado de endometriose. Essa condição pode afetar a fertilidade de forma silenciosa e merece investigação e acompanhamento dedicados, mesmo que o restante do seu mapa esteja equilibrado.",
    severidade: "alerta",
  },
  {
    id: "idade_avancada",
    categoriaId: "fatores_infertilidade",
    titulo: "Idade reprodutiva",
    condicao: (r) => r.idade <= 1, // 39-41 anos ou acima de 41
    mensagem:
      "Sua faixa etária está associada a uma queda natural na reserva ovariana. Isso não impede uma gestação, mas reforça a importância de não adiar exames como AMH e contagem de folículos antrais, e de buscar avaliação especializada caso a tentativa de engravidar já esteja em curso.",
    severidade: "atencao",
  },
  {
    id: "doenca_autoimune",
    categoriaId: "fatores_infertilidade",
    titulo: "Doença autoimune",
    condicao: (r) => r.autoimune_geral === 0,
    mensagem:
      "Você indicou ter uma doença autoimune (como Hashimoto ou Lúpus). Condições autoimunes podem impactar a fertilidade e merecem acompanhamento conjunto com seu especialista, alinhado ao seu plano de fertilidade.",
    severidade: "alerta",
  },
  {
    id: "obstrucao_tubaria",
    categoriaId: "fatores_infertilidade",
    titulo: "Obstrução tubária",
    condicao: (r) => r.obstrucao_tubaria === 0,
    mensagem:
      "Você indicou histórico de obstrução nas trompas. Esse é um fator mecânico de infertilidade que, dependendo do grau, pode exigir avaliação para concepção natural versus técnicas assistidas — converse com seu especialista em reprodução sobre os próximos passos.",
    severidade: "alerta",
  },
  {
    id: "imc_fora_da_faixa",
    categoriaId: "fatores_infertilidade",
    titulo: "Peso corporal",
    condicao: (r) => r.obesidade === 0 || r.magreza === 0,
    mensagem:
      "Seu IMC está fora da faixa associada à fertilidade ideal. Tanto o excesso quanto a magreza severa podem alterar a produção hormonal e a ovulação — um acompanhamento nutricional pode ajudar a reequilibrar esse pilar.",
    severidade: "atencao",
  },
  {
    id: "tsh_alterado",
    categoriaId: "tireoide",
    titulo: "TSH alterado",
    condicao: (r) => r.tsh === 0,
    mensagem:
      "Seu TSH está fora da faixa ideal (acima de 3,5). Alterações tireoidianas têm relação direta com regularidade do ciclo e ovulação — vale uma reavaliação endócrina específica para esse marcador.",
    severidade: "alerta",
  },
  {
    id: "anovulacao",
    categoriaId: "ciclo",
    titulo: "Ausência de ovulação confirmada",
    condicao: (r) => r.ovulacao === 0 || r.ciclo_regular === 0,
    mensagem:
      "Suas respostas indicam ciclo ausente e/ou ausência de ovulação confirmada. Esse é um dos sinais mais diretos de alerta para fertilidade e merece investigação prioritária com ginecologista.",
    severidade: "alerta",
  },
  {
    id: "esteatose_hepatica",
    categoriaId: "figado",
    titulo: "Esteatose hepática",
    condicao: (r) => r.esteatose_hepatica <= 1, // moderada ou grave
    mensagem:
      "Você indicou diagnóstico de esteatose hepática moderada ou grave. A sobrecarga no fígado interfere na metabolização de hormônios (incluindo o estrogênio) e pode impactar indiretamente a fertilidade — esse ponto merece atenção em paralelo ao restante do plano.",
    severidade: "atencao",
  },
  {
    id: "doenca_autoimune_confirmada_bloco8",
    categoriaId: "imunidade",
    titulo: "Doença autoimune confirmada",
    condicao: (r) => r.doencas_autoimunes_grau <= 1, // confirmada leve ou grave
    mensagem:
      "Você confirmou uma doença autoimune com impacto no seu sistema imunológico. Isso reforça a importância de manter o acompanhamento médico já em curso em paralelo às recomendações deste relatório.",
    severidade: "atencao",
  },
];

export function avaliarRiscos(respostas: Respostas) {
  return REGRAS_RISCO.filter((regra) => regra.condicao(respostas)).map((regra) => ({
    id: regra.id,
    categoriaId: regra.categoriaId,
    titulo: regra.titulo,
    mensagem: regra.mensagem,
    severidade: regra.severidade,
  }));
}
