import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { RelatorioDocument } from "./RelatorioDocument";
import { ResultadoRelatorio } from "../types";

export async function gerarPdfRelatorio(resultado: ResultadoRelatorio): Promise<Buffer> {
  return renderToBuffer(<RelatorioDocument resultado={resultado} />);
}
