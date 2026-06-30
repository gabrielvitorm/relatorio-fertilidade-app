import { CATEGORIAS } from "./conteudo/categorias";
import { maximoCategoria, maximoGeral, PERGUNTAS_POR_CATEGORIA } from "./pesos";
import {
  CATEGORIA_IDS,
  CategoriaId,
  NivelCategoria,
  NivelGeral,
  Respostas,
  ResultadoCategoria,
} from "./types";

/** Mesmos thresholds usados no Typebot (função `niv()` de cada categoria) */
function nivelPorPercentual(percentual: number): NivelCategoria {
  if (percentual >= 80) return "Alto";
  if (percentual >= 60) return "Moderado";
  return "Baixo";
}

/** Mesmos thresholds usados no grupo de Condition do Typebot (>80 / 60-80 / <60) */
export function nivelGeralPorPercentual(percentual: number): NivelGeral {
  if (percentual > 80) return "Alta";
  if (percentual >= 60) return "Moderada";
  return "Baixa";
}

function calcularPontuacaoCategoria(id: CategoriaId, respostas: Respostas): number {
  const perguntas = PERGUNTAS_POR_CATEGORIA[id];
  const somaRespostas = perguntas.reduce((acc, key) => acc + (respostas[key] ?? 0), 0);
  // No Typebot: pontuacao_categoria = soma_das_perguntas * peso_da_categoria
  const peso = maximoCategoria(id) / (perguntas.length * 3);
  return somaRespostas * peso;
}

export function calcularCategoria(id: CategoriaId, respostas: Respostas): ResultadoCategoria {
  const pontuacao = calcularPontuacaoCategoria(id, respostas);
  const pontuacaoMaxima = maximoCategoria(id);
  const percentual = (pontuacao / pontuacaoMaxima) * 100;
  const nivel = nivelPorPercentual(percentual);
  const def = CATEGORIAS[id];
  const texto = def.textos[nivel];

  return {
    id,
    label: def.label,
    emoji: def.emoji,
    pontuacao: Number(pontuacao.toFixed(2)),
    pontuacaoMaxima,
    percentual: Number(percentual.toFixed(1)),
    nivel,
    analise: texto.analise,
    recomendacao: texto.recomendacao,
  };
}

export function calcularTodasCategorias(respostas: Respostas): ResultadoCategoria[] {
  return CATEGORIA_IDS.map((id) => calcularCategoria(id, respostas));
}

export function calcularResumoGeral(categorias: ResultadoCategoria[]) {
  const pontuacaoTotal = categorias.reduce((acc, c) => acc + c.pontuacao, 0);
  const pontuacaoMaxima = maximoGeral();
  const percentual = Number(((pontuacaoTotal / pontuacaoMaxima) * 100).toFixed(2));
  const nivelGeral = nivelGeralPorPercentual(percentual);

  return { pontuacaoTotal: Number(pontuacaoTotal.toFixed(2)), pontuacaoMaxima, percentual, nivelGeral };
}
