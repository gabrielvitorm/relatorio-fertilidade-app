import { z } from "zod";

/**
 * Cada resposta do questionário chega como um número (a "pontuação" daquela
 * opção, exatamente como o Typebot já fazia: 0 a 3 na maioria dos casos).
 * Quem traduz a resposta literal do Typebot ("Sim", "Não", "Suspeita"...)
 * para esse número é o node do n8n que monta o payload (ver README).
 */
const nota = z.number().min(0).max(3);

export const RespostasSchema = z.object({
  // Bloco 1 — Fatores de infertilidade (peso 3)
  idade: nota,
  endometriose: nota,
  sop: nota,
  celiaca: nota,
  autoimune_geral: nota,
  obstrucao_tubaria: nota,
  obesidade: nota,
  magreza: nota,

  // Bloco 2 — Saúde hormonal (peso 3)
  fsh: nota,
  amh: nota,
  foliculos_antrais: nota,
  progesterona: nota,

  // Bloco 3 — Qualidade do sono (peso 2)
  horas_sono: nota,
  profundidade_sono: nota,
  sonha_muito: nota,
  dificuldade_dormir: nota,

  // Bloco 4 — Atividade física (peso 2)
  frequencia_exercicio: nota,
  treino_equilibrado: nota,
  sedentarismo: nota,

  // Bloco 5 — Alimentação (peso 2)
  ultraprocessados: nota,
  fibras_frutas_vegetais: nota,
  proteinas_qualidade: nota,

  // Bloco 6 — Saúde intestinal (peso 2)
  frequencia_evacuacao: nota,
  gases_inchaco: nota,
  disbiose_antibiotico: nota,

  // Bloco 7 — Fígado e detoxificação (peso 2)
  esteatose_hepatica: nota,
  uso_medicamentos: nota,
  cor_lingua: nota,
  sintomas_tpm_acne: nota,

  // Bloco 8 — Imunidade e inflamação (peso 2)
  frequencia_infeccoes: nota,
  doencas_autoimunes_grau: nota,
  marcadores_inflamatorios: nota,

  // Bloco 9 — Estresse e eixo HPA (peso 2)
  estresse_diario: nota,
  exaustao: nota,
  ansiedade_insonia: nota,

  // Bloco 10 — Ciclo menstrual e ovulação (peso 3)
  ciclo_regular: nota,
  ovulacao: nota,
  fluxo_menstrual: nota,

  // Bloco 11 — Tireoide (peso 2)
  tsh: nota,

  // Bloco 12 — Toxinas ambientais (peso 1)
  exposicao_toxinas: nota,

  // Bloco 13 — Histórico familiar (peso 1)
  historico_familiar: nota,
});

export type Respostas = z.infer<typeof RespostasSchema>;

export const PayloadRelatorioSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().min(8).optional(),
  // chave externa opcional (id da execução do Typebot/linha da planilha),
  // útil para rastrear/depurar e para nomear o arquivo do PDF
  referencia: z.string().optional(),
  respostas: RespostasSchema,
});

export type PayloadRelatorio = z.infer<typeof PayloadRelatorioSchema>;

export type NivelCategoria = "Alto" | "Moderado" | "Baixo";
export type NivelGeral = "Alta" | "Moderada" | "Baixa";

export interface ResultadoCategoria {
  id: CategoriaId;
  label: string;
  emoji: string;
  pontuacao: number;
  pontuacaoMaxima: number;
  percentual: number; // 0-100
  nivel: NivelCategoria;
  analise: string;
  recomendacao: string;
}

export interface IndicadorRisco {
  id: string;
  categoriaId: CategoriaId;
  titulo: string;
  mensagem: string;
  severidade: "atencao" | "alerta";
}

export interface ItemPlanoAcao {
  titulo: string;
  texto: string;
  origem: "risco" | "categoria";
  prioridade: number; // menor = mais urgente
}

export interface ResultadoRelatorio {
  nome: string;
  email: string;
  pontuacaoTotal: number;
  pontuacaoMaxima: number;
  percentual: number; // 0-100, 2 casas
  nivelGeral: NivelGeral;
  categorias: ResultadoCategoria[];
  indicadoresRisco: IndicadorRisco[];
  planoDeAcao: ItemPlanoAcao[];
}

export const CATEGORIA_IDS = [
  "fatores_infertilidade",
  "saude_hormonal",
  "qualidade_sono",
  "atividade_fisica",
  "alimentacao",
  "saude_intestinal",
  "figado",
  "imunidade",
  "estresse",
  "ciclo",
  "tireoide",
  "toxinas",
  "historico",
] as const;

export type CategoriaId = (typeof CATEGORIA_IDS)[number];
