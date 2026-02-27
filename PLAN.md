# CloseFlow MVP Plan

## Scope
Build a production-shaped MVP for real-estate closing operations:
- Auth + role model
- Core closing entities and API routes
- Dashboard + deal workspace UI
- Three baseline automations
- Seed data and setup scripts

## Architecture
- **Frontend**: Next.js App Router + TypeScript + Tailwind
- **Backend**: Next.js Route Handlers (REST-ish)
- **DB**: PostgreSQL + Prisma ORM
- **Auth**: JWT cookie session (roles: admin/coordinator/agent/viewer)

## Data Model
- organizations
- users
- deals
- parties
- milestones
- tasks
- documents
- communications
- events
- automation_runs

## Deliverables
1. Prisma schema + seed script
2. Auth endpoints (`/api/auth/login`, `/api/auth/logout`)
3. Functional APIs for requested resources
4. UI pages: login, dashboard, deals list/detail with task+milestone/doc/timeline/readiness
5. Automations endpoint (`/api/automations/run`) implementing:
   - deadline sentinel (48h/24h/overdue with day-band dedupe)
   - missing document chaser
   - closing readiness brief
6. README with setup + demo credentials

## LLM Phases Implemented (2026-02-27)
- ✅ Phase 1 Copilot
  - Deal Summary Generator
  - Message Drafting Assistant (review + approve/send)
  - Closing Readiness Explanation
- ✅ Phase 2 Workflow Intelligence
  - Risk/Delay Predictor
  - Document indexing + Q&A with citations
  - Negotiation Prep Pack
- ✅ Phase 3 Semi-Autonomous (guardrailed)
  - Auto-follow-up agent with org config (whitelist + approval gate + optional auto-send)
  - Meeting Notes → Tasks extractor
  - Deal Rescue mode for overdue deals

### Technical delivery notes
- Added Prisma models: `LlmRequest`, `LlmSuggestion`, `DocChunk`, `LlmConfig`, `LlmAuditLog`
- Added token/cost tracking stubs in `LlmRequest`
- Added retrieval pipeline (chunking + keyword/surrogate embedding search)
- Added `/api/llm/*` endpoints and deal workspace UI panel
- Added Vercel AI SDK integration with env-configurable fast/strong models

## Follow-ups
- Stronger structured extraction for meeting notes (owner + due date parser)
- Real outbound transport integration for send actions (email/SMS) instead of communication-log simulation
- Optional pgvector upgrade for semantic retrieval
- Tests for llm guardrails and citation quality
