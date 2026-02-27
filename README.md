# CloseFlow (MVP)

CloseFlow is a lightweight real-estate closing workflow app built as an MVP.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- PostgreSQL 17 + Prisma
- Cookie JWT auth with roles: `admin`, `coordinator`, `agent`, `viewer`

## Features
- Login page + role-aware sessions
- i18n (EN/DE) with locale switcher and translated key pages/components
- Dashboard with active deals, open tasks, missing docs, readiness score
- Deals list + deal detail workspace
  - tasks + milestones
  - docs checklist
  - timeline/events
  - communications
  - readiness score
- Functional APIs for:
  - deals
  - parties
  - milestones
  - tasks
  - documents
  - communications
  - automations
- Automations:
  1. **Deadline sentinel**: 48h/24h/overdue detection with dedupe (`deal + band + day`)
  2. **Missing document chaser**: identifies required docs not uploaded
  3. **Closing readiness brief**: score snapshot across deals

## Quick Start

### 1) Start required services (PostgreSQL + Adminer)

```bash
docker compose up -d
```

- PostgreSQL: `localhost:5432`
- Adminer: `http://localhost:8080`

### 2) Start app

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

Open `http://localhost:3000`.

## Demo Credentials
All users use password: `demo1234`
- `admin@closeflow.dev`
- `coordinator@closeflow.dev`
- `agent@closeflow.dev`
- `viewer@closeflow.dev`

## Scripts
- `npm run dev` – run app
- `npm run lint` – lint
- `npm run build` – production build
- `npm run db:generate` – prisma client
- `npm run db:push` – sync schema
- `npm run db:seed` – seed demo data
- `npm run setup` – generate + push + seed

## Internationalization (i18n)
- Supported locales: `en`, `de`
- Locale is stored in cookie: `closeflow_locale`
- Switch language:
  - Login page language toggle (EN/DE)
  - App navigation language toggle (EN/DE)
- Translation dictionaries live in `src/lib/i18n/dictionaries.ts`

## API Summary
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET/POST /api/deals`
- `GET/PATCH /api/deals/:id`
- `GET/POST /api/parties`
- `GET/POST /api/milestones`
- `GET/POST /api/tasks`
- `GET/POST /api/documents`
- `GET/POST /api/communications`
- `POST /api/automations/run`

## Notes
- MVP prioritizes working flow over complete enterprise hardening.
- Middleware enforces login; deeper per-action RBAC is planned post-MVP.
