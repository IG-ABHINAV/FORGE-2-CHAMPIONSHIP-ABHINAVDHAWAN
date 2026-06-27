# PulseDesk — Forge 2 / Edition 1

A multi-tenant support-desk SaaS built by orchestrating **Hermes** (PO/planner) + **OpenClaw** (coder) over Slack, with all model calls routed through **EastRouter**.

## Stack
- **Backend**: Laravel 11 · PHP 8.2 · MySQL 8 · Laravel Sanctum
- **Frontend**: React 19 · Vite · Tailwind CSS v4

## EastRouter Models Used
| Model | Agent | Role |
|-------|-------|------|
| `z-ai/glm-5.1` | OpenClaw | Coding — all implementation, tests, migrations |
| `moonshotai/kimi-k2.6` | Hermes | Planning — sprint decomposition, task specs |
| `moonshotai/kimi-k2.7-code` | QA Reviewer | Code review, PR verification, test analysis |

## Live URLs
| Service | URL |
|---------|-----|
| **Backend API** (Render) | https://pulsedesk-backend-qsrr.onrender.com |
| **Frontend App** (Vercel) | https://frontend-l0xu52wqp-abhinav-dhawans-projects.vercel.app |

## How to Run (EXACT — a judge will run these from a fresh clone)

### Backend (Laravel + MySQL)
```bash
cd backend
cp .env.example .env          # set DB_* for your MySQL instance
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve             # → http://127.0.0.1:8000
```

### Frontend (React + Vite)
```bash
cd frontend
cp .env.example .env          # VITE_API_URL already set to live backend
npm install
npm run dev                   # → http://localhost:3000
```

## Demo Logins (from seeder)
| Email | Password | Role |
|-------|----------|------|
| admin@acme.test | password | admin |
| agent@acme.test | password | agent |
| customer@acme.test | password | customer |

## Agent Orchestration
```
Human (PO) → Hermes (Sprint Planning) → OpenClaw (Coding) → CI/CD → Human Review → Merge to main
```
- **Hermes** plans sprints, decomposes tasks, assigns to OpenClaw via `#sprint-main`
- **OpenClaw** codes, tests, commits, reports via `#agent-coder`
- **QA Reviewer** checks PRs, runs tests via `#ci-cd`
- **Human** reviews and merges PRs to `main`
- All EastRouter API calls logged in `#agent-log`

## Where Evidence Lives (everything in THIS repo — no Drive, no video)
| Path | Contents |
|------|----------|
| `agents/hermes/` | Hermes config (model, memory, Slack channels) |
| `agents/openclaw/` | OpenClaw config (model, workspace, tools, command-exec) |
| `agents/skills/` | QA Reviewer + CI/Deploy agent configs |
| `agent-log.md` | The human → Hermes → OpenClaw loop with timestamps |
| `sprints/` | Sprint-01, Sprint-02, Sprint-03 docs |
| `slack-export/` | Per-channel screenshots of agent activity |
| `evidence/screenshots/` | App, agents-running, CI screenshots |
| `ARCHITECTURE.md` | Data model, API routes, multi-tenancy approach |
| `SUBMISSION.md` | Submission checklist with all items ticked |
