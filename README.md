# CloseFlow (MVP + LLM Phases)

CloseFlow is a real-estate closing workflow app built with Next.js + Prisma + PostgreSQL.

## Stack
- Next.js App Router + TypeScript + Tailwind
- PostgreSQL 17 + Prisma
- Auth: cookie JWT roles (`admin`, `coordinator`, `agent`, `viewer`)
- LLM: Vercel AI SDK (`ai`, `@ai-sdk/openai`) with env-configurable fast/strong models

## LLM Features Implemented

### Phase 1 (Copilot)
1. Deal Summary Generator
2. Message Drafting Assistant (creates reviewable suggestion; send requires approval by default)
3. Closing Readiness Explanation

### Phase 2 (Workflow Intelligence)
4. Risk/Delay Predictor
5. Document Q&A with citations from indexed chunks
6. Negotiation Prep Pack

### Phase 3 (Semi-Autonomous + guardrails)
7. Auto-follow-up agent (template whitelist + approval gate + opt-in auto-send)
8. Meeting Notes → Tasks (creates tasks from extracted action lines)
9. Deal Rescue mode for overdue deals

## Data Model Additions
- `LlmRequest` (prompt/response/model/confidence/token+cost stubs)
- `LlmSuggestion` (approval/sent state machine)
- `DocChunk` (chunked retrieval index + surrogate embedding/keywords)
- `LlmConfig` (org-level auto-followup/approval/whitelist)
- `LlmAuditLog` (guardrail actions)
- `Document.textContent` + `Document.metadata`

## API Routes (`/api/llm/*`)
- `POST /api/llm/summary`
- `POST /api/llm/message-draft`
- `POST /api/llm/readiness`
- `POST /api/llm/risk-delay`
- `POST /api/llm/document-index`
- `POST /api/llm/document-qa`
- `POST /api/llm/negotiation-pack`
- `POST /api/llm/auto-followup`
- `POST /api/llm/meeting-notes`
- `POST /api/llm/rescue-mode`
- `POST /api/llm/suggestions/:id/approve`
- `POST /api/llm/suggestions/:id/send`

## Retrieval Pipeline
- Document ingestion into `DocChunk` via `/api/llm/document-index`
- Chunking + keyword extraction + surrogate `embedding` JSON
- Query-time keyword scoring + top-k citations for Q&A

## Guardrails
- Human-in-the-loop default (`LlmSuggestion.pending_review`)
- Explicit approve/send endpoints
- Auto-send only when all true:
  - `LlmConfig.autoFollowupEnabled=true`
  - template is whitelisted
  - approval condition satisfied
- All approvals/sends logged in `LlmAuditLog`

## Quick Start
```bash
docker compose up -d
cp .env.example .env
npm install
npm run setup
npm run dev
```

Open `http://localhost:3000`.

## Demo Credentials
All users password: `demo1234`
- `admin@closeflow.dev`
- `coordinator@closeflow.dev`
- `agent@closeflow.dev`
- `viewer@closeflow.dev`

## Validation
```bash
npm run lint
npm run build
```

## Notes
- If `OPENAI_API_KEY` is not set, LLM routes return deterministic fallback text so flows still function end-to-end.
- AI output includes disclaimer text where applicable; users must verify legal/compliance details.
