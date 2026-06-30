import { calcularResumoGeral, calcularTodasCategorias } from "./scoring";
import { avaliarRiscos } from "./risco/regras";
import { montarPlanoDeAcao } from "./plano-de-acao";
import { PayloadRelatorio, ResultadoRelatorio } from "./types";

export function montarResultado(payload: PayloadRelatorio): ResultadoRelatorio {
  const categorias = calcularTodasCategorias(payload.respostas);
  const resumo = calcularResumoGeral(categorias);
  const indicadoresRisco = avaliarRiscos(payload.respostas);
  const planoDeAcao = montarPlanoDeAcao(categorias, indicadoresRisco);

  return {
    nome: payload.nome,
    email: payload.email,
    pontuacaoTotal: resumo.pontuacaoTotal,
    pontuacaoMaxima: resumo.pontuacaoMaxima,
    percentual: resumo.percentual,
    nivelGeral: resumo.nivelGeral,
    categorias,
    indicadoresRisco,
    planoDeAcao,
  };
}
