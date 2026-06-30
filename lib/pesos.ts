import { CATEGORIA_IDS, CategoriaId, Respostas } from "./types";

/**
 * IMPORTANTE — leia antes de mexer aqui.
 *
 * Esses pesos e agrupamentos foram extraídos diretamente do fluxo Typebot
 * (grupo "Definição de Pesos" + os blocos de cada categoria). Durante a
 * extração encontrei 2 inconsistências no fluxo original que foram
 * corrigidas aqui (ver README > "Auditoria do fluxo original"):
 *
 *  1) O peso de "Atividade Física" nunca era definido no Typebot (a
 *     variável `peso4_atividade_score` não tinha nenhum "Set variable").
 *     Isso fazia o score dessa categoria sempre dar 0/NaN, ou seja, essa
 *     categoria nunca funcionou de verdade. Defini peso = 2, igual às
 *     outras categorias de 3 perguntas (alimentação, intestino, estresse).
 *
 *  2) Quatro categorias (fígado, imunidade, tireoide, toxinas) tinham um
 *     "máximo" travado no código (`const max = 18`, etc.) que não batia
 *     com peso × soma das perguntas daquela categoria. Em 3 delas isso
 *     tornava o nível "Alto" (ou até "Moderado", no caso de toxinas)
 *     matematicamente impossível de alcançar, não importa a resposta da
 *     usuária. Aqui o máximo de cada categoria é sempre calculado
 *     dinamicamente (peso × soma das perguntas), nunca hardcoded — então
 *     esse bug não pode mais acontecer.
 *
 *  Curiosidade que reforça que isso é mesmo um bug e não uma escolha de
 *  produto: somando peso×perguntas de TODAS as 13 categorias com essas
 *  correções, o total dá exatamente 285 — o mesmo divisor que o Typebot
 *  já usava (`resultado_final = score_total / 285 * 100`). Ou seja, o
 *  "285" original estava certo; só os pesos/máximos individuais é que
 *  tinham se perdido/dessincronizado ao longo das edições do fluxo.
 */

export const PESOS: Record<CategoriaId, number> = {
  fatores_infertilidade: 3,
  saude_hormonal: 3,
  qualidade_sono: 2,
  atividade_fisica: 2, // corrigido — ver nota acima
  alimentacao: 2,
  saude_intestinal: 2,
  figado: 2,
  imunidade: 2,
  estresse: 2,
  ciclo: 3,
  tireoide: 2,
  toxinas: 1,
  historico: 1,
};

export const PERGUNTAS_POR_CATEGORIA: Record<CategoriaId, (keyof Respostas)[]> = {
  fatores_infertilidade: [
    "idade",
    "endometriose",
    "sop",
    "celiaca",
    "autoimune_geral",
    "obstrucao_tubaria",
    "obesidade",
    "magreza",
  ],
  saude_hormonal: ["fsh", "amh", "foliculos_antrais", "progesterona"],
  qualidade_sono: [
    "horas_sono",
    "profundidade_sono",
    "sonha_muito",
    "dificuldade_dormir",
  ],
  atividade_fisica: ["frequencia_exercicio", "treino_equilibrado", "sedentarismo"],
  alimentacao: ["ultraprocessados", "fibras_frutas_vegetais", "proteinas_qualidade"],
  saude_intestinal: ["frequencia_evacuacao", "gases_inchaco", "disbiose_antibiotico"],
  figado: ["esteatose_hepatica", "uso_medicamentos", "cor_lingua", "sintomas_tpm_acne"],
  imunidade: ["frequencia_infeccoes", "doencas_autoimunes_grau", "marcadores_inflamatorios"],
  estresse: ["estresse_diario", "exaustao", "ansiedade_insonia"],
  ciclo: ["ciclo_regular", "ovulacao", "fluxo_menstrual"],
  tireoide: ["tsh"],
  toxinas: ["exposicao_toxinas"],
  historico: ["historico_familiar"],
};

const NOTA_MAXIMA_POR_PERGUNTA = 3;

/** Pontuação máxima possível de uma categoria (peso × nº de perguntas × 3) */
export function maximoCategoria(id: CategoriaId): number {
  return PESOS[id] * PERGUNTAS_POR_CATEGORIA[id].length * NOTA_MAXIMA_POR_PERGUNTA;
}

/** Pontuação máxima possível do relatório inteiro (soma de todas as categorias) */
export function maximoGeral(): number {
  return CATEGORIA_IDS.reduce((acc, id) => acc + maximoCategoria(id), 0);
}
