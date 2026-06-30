import { NextRequest, NextResponse } from "next/server";
import { PayloadRelatorioSchema } from "@/lib/types";
import { montarResultado } from "@/lib/relatorio";
import { gerarPdfRelatorio } from "@/lib/pdf/gerar-pdf";

export const runtime = "nodejs";

/**
 * Contrato esperado (ver README > "Contrato do webhook"):
 *
 * POST /api/relatorio
 * Header: x-api-key: <RELATORIO_API_KEY>
 * Body: {
 *   "nome": "Maria Silva",
 *   "email": "maria@email.com",
 *   "telefone": "+5511999999999",   // opcional
 *   "referencia": "typebot-result-id-123", // opcional, vira parte do nome do arquivo
 *   "respostas": { idade: 3, sop: 0, ... }  // ver lib/types.ts
 * }
 *
 * Resposta: o PDF em binário (application/pdf), pronto para o n8n anexar
 * em e-mail / enviar por WhatsApp, ou subir para onde preferir.
 */
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.RELATORIO_API_KEY) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ erro: "JSON inválido" }, { status: 400 });
  }

  const parsed = PayloadRelatorioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { erro: "payload inválido", detalhes: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const resultado = montarResultado(parsed.data);
  const pdfBuffer = await gerarPdfRelatorio(resultado);

  const nomeArquivo = `mapa-da-fertilidade-${slugify(parsed.data.nome)}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${nomeArquivo}"`,
    },
  });
}

function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
