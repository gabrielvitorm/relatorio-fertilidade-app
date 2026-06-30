# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A stateless Next.js app with a single API endpoint (`POST /api/relatorio`) that receives questionnaire answers (sent by n8n after a Typebot session), calculates a fertility score across 13 categories, evaluates clinical risk indicators, and returns a personalized PDF — all without a database or AI calls.

## Commands

```bash
npm install
npm run dev          # start Next.js dev server (http://localhost:3000)
npm run build        # production build
npm run start        # start production server
npm run test:scoring # run scoring logic tests without a server (uses tsx directly)
```

Required env var: `RELATORIO_API_KEY` (set in `.env.local` for dev). See `.env.example`.

Testing the endpoint without n8n:
```bash
curl -X POST http://localhost:3000/api/relatorio \
  -H "x-api-key: defina-uma-chave-forte" \
  -H "Content-Type: application/json" \
  -d @examples/payload-sop-com-resto-bom.json \
  --output relatorio.pdf
```

No linting script is configured. TypeScript checking: `npx tsc --noEmit`.

## Architecture

### Data flow

```
POST /api/relatorio  (route.ts)
  → PayloadRelatorioSchema.safeParse()   (lib/types.ts — Zod)
  → montarResultado()                    (lib/relatorio.ts — orchestrator)
      → calcularTodasCategorias()        (lib/scoring.ts)
      → avaliarRiscos()                  (lib/risco/regras.ts)
      → montarPlanoDeAcao()              (lib/plano-de-acao.ts)
  → gerarPdfRelatorio()                  (lib/pdf/gerar-pdf.tsx)
  ← returns PDF binary (application/pdf)
```

### Scoring (`lib/scoring.ts` + `lib/pesos.ts`)

Each answer is 0–3. A category score = `soma_das_respostas × peso_da_categoria`. The maximum per category is computed dynamically by `maximoCategoria(id)` in `lib/pesos.ts` — **never hardcoded** (this was the source of the original Typebot bugs documented in the README). Category levels: Alto ≥ 80%, Moderado ≥ 60%, Baixo < 60%. Overall total divides by 285.

### Risk indicators (`lib/risco/regras.ts`)

Risk indicators are evaluated against **raw answers**, not category scores. This is intentional: a person with SOP (score 0 on that field) can still have a high overall fertility score if everything else is good, so the category average would hide the clinical risk. The `REGRAS_RISCO` array is a simple lookup table — each rule has a `condicao(respostas)` predicate. To add a new rule: copy an entry from the array.

### PDF rendering (`lib/pdf/`)

Uses `@react-pdf/renderer` (not Puppeteer). This avoids needing Chromium on the VPS. Key constraint: **emoji and icon fonts don't work** in standard PDF fonts — icons in `lib/pdf/icons.tsx` are hand-drawn inline SVG paths, and `lib/pdf/sem-emoji.ts` explains the fallback decisions. The main document is `lib/pdf/RelatorioDocument.tsx`, which uses theme constants from `lib/pdf/theme.ts`.

### Content (`lib/conteudo/`)

- `categorias.ts` — label, emoji, and the three levels of analysis/recommendation text per category
- `grupos.ts` — groups the 13 categories into 3 themes for PDF layout (Fatores Clínicos, Estilo de Vida, Corpo e Equilíbrio Interno)
- `classificacao-geral.ts` — overall-level text blocks

## Key constraints

- The `runtime = "nodejs"` export in `route.ts` is required — `@react-pdf/renderer` is not Edge-compatible.
- `RELATORIO_API_KEY` must be set; requests without the matching header return 401.
- Answers arriving as `null`/`undefined` from n8n (e.g. the Progesterona "não sei" option) must be coerced to `0` before sending — Zod rejects non-numbers.
