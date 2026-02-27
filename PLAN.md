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

## Follow-ups (Post-MVP)
- RBAC enforcement per route/action
- Pagination/filtering and optimistic mutations
- Background jobs for automations (cron/queue)
- File uploads + cloud storage
- Notification channels (email/SMS/Slack)
- Test suite + CI pipeline
