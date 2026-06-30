import { IndicadorRisco, ItemPlanoAcao, ResultadoCategoria } from "./types";

const MAXIMO_ITENS = 6;

/**
 * Sintetiza o relatório inteiro numa lista curta e priorizada — em vez de
 * a usuária ter que reler 13 cards pra entender "por onde eu começo".
 *
 * Prioridade: 1) indicadores de risco clínico (sempre os mais urgentes,
 * independente do nível geral), 2) categorias com nível Baixo, ordenadas
 * da pior pra melhor, 3) categorias Moderado, mesma lógica. Categorias
 * "Alto" não entram no plano de ação — não precisam de ação, só de
 * manutenção (isso já fica claro no card delas).
 */
export function montarPlanoDeAcao(
  categorias: ResultadoCategoria[],
  indicadoresRisco: IndicadorRisco[]
): ItemPlanoAcao[] {
  const itens: ItemPlanoAcao[] = [];

  for (const risco of indicadoresRisco) {
    itens.push({
      titulo: risco.titulo,
      texto: risco.mensagem,
      origem: "risco",
      prioridade: risco.severidade === "alerta" ? 0 : 1,
    });
  }

  const fracas = categorias
    .filter((c) => c.nivel !== "Alto")
    .sort((a, b) => a.percentual - b.percentual);

  for (const categoria of fracas) {
    itens.push({
      titulo: categoria.label,
      texto: categoria.recomendacao,
      origem: "categoria",
      prioridade: categoria.nivel === "Baixo" ? 2 : 3,
    });
  }

  return itens
    .sort((a, b) => a.prioridade - b.prioridade)
    .slice(0, MAXIMO_ITENS);
}
