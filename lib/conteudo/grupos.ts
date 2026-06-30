import { CategoriaId } from "../types";

export interface GrupoTematico {
  id: string;
  titulo: string;
  descricao: string;
  categorias: CategoriaId[];
}

/**
 * As 13 categorias do questionário, organizadas em 3 grupos temáticos.
 * Isso é o que transforma "13 cards soltos" num relatório com narrativa:
 * primeiro o que é mais clínico/estrutural, depois o que é rotina do
 * dia a dia, depois o que é equilíbrio interno do corpo.
 */
export const GRUPOS_TEMATICOS: GrupoTematico[] = [
  {
    id: "clinico",
    titulo: "Fatores Clínicos",
    descricao:
      "Os pilares mais diretamente ligados ao diagnóstico médico da sua fertilidade — onde exames e acompanhamento especializado fazem mais diferença.",
    categorias: ["fatores_infertilidade", "saude_hormonal", "ciclo", "tireoide"],
  },
  {
    id: "estilo_vida",
    titulo: "Estilo de Vida",
    descricao:
      "Hábitos do dia a dia que você consegue ajustar com mais autonomia, e que têm efeito direto sobre o equilíbrio hormonal.",
    categorias: ["qualidade_sono", "atividade_fisica", "alimentacao", "estresse"],
  },
  {
    id: "equilibrio_interno",
    titulo: "Corpo e Equilíbrio Interno",
    descricao:
      "Como seu corpo processa, absorve e se protege — a base fisiológica que sustenta todos os outros pilares.",
    categorias: ["saude_intestinal", "figado", "imunidade", "toxinas", "historico"],
  },
];
