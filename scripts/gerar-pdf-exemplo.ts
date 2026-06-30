import { readFileSync, writeFileSync } from "node:fs";
import { PayloadRelatorioSchema } from "../lib/types";
import { montarResultado } from "../lib/relatorio";
import { gerarPdfRelatorio } from "../lib/pdf/gerar-pdf";

async function gerar(caminhoEntrada: string, caminhoSaida: string) {
  const json = JSON.parse(readFileSync(caminhoEntrada, "utf-8"));
  const payload = PayloadRelatorioSchema.parse(json);
  const resultado = montarResultado(payload);
  const pdf = await gerarPdfRelatorio(resultado);
  writeFileSync(caminhoSaida, pdf);
  console.log(`Gerado: ${caminhoSaida} (${(pdf.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  await gerar("examples/payload-sop-com-resto-bom.json", "examples/saida-exemplo-sop.pdf");
  await gerar("examples/payload-baixa.json", "examples/saida-exemplo-baixa.pdf");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
