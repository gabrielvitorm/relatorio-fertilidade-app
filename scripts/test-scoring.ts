import { readFileSync } from "node:fs";
import { PayloadRelatorioSchema } from "../lib/types";
import { montarResultado } from "../lib/relatorio";
import { maximoGeral } from "../lib/pesos";

function carregarExemplo(caminho: string) {
  const json = JSON.parse(readFileSync(caminho, "utf-8"));
  return PayloadRelatorioSchema.parse(json);
}

function rodar(caminho: string) {
  console.log("\n" + "=".repeat(70));
  console.log("Arquivo:", caminho);
  const payload = carregarExemplo(caminho);
  const resultado = montarResultado(payload);

  console.log(`Nome: ${resultado.nome}`);
  console.log(
    `Pontuação total: ${resultado.pontuacaoTotal} / ${resultado.pontuacaoMaxima} (${resultado.percentual}%)`
  );
  console.log(`Classificação geral: ${resultado.nivelGeral}`);

  console.log("\nCategorias:");
  for (const c of resultado.categorias) {
    console.log(
      `  - ${c.label.padEnd(28)} ${c.pontuacao}/${c.pontuacaoMaxima}  (${c.percentual}%)  -> ${c.nivel}`
    );
  }

  console.log(`\nIndicadores de risco encontrados: ${resultado.indicadoresRisco.length}`);
  for (const r of resultado.indicadoresRisco) {
    console.log(`  [${r.severidade.toUpperCase()}] ${r.titulo}: ${r.mensagem.slice(0, 90)}...`);
  }
}

console.log("Máximo geral calculado dinamicamente (deve dar 285):", maximoGeral());

rodar("examples/payload-sop-com-resto-bom.json");
rodar("examples/payload-baixa.json");
