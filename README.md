# PulseDesk — Forge 2 / Edition 1

A multi-tenant support-desk SaaS built by orchestrating **Hermes** (PO/planner) + **OpenClaw** (coder) over Slack, with all model calls routed through **EastRouter**.

## Stack
- **Backend**: Laravel 11 · PHP 8.2 · MySQL 8 · Laravel Sanctum
- **Frontend**: React 19 · Vite · Tailwind CSS v4

## EastRouter Models Used
- **Hermes** (planning / product owner): `moonshotai/kimi-k2.6`
- **OpenClaw** (coding): `z-ai/glm-5.1`
- **QA / Review**: `moonshotai/kimi-k2.7-code`

## Live URL
**Backend API**: https://pulsedesk-backend-qsrr.onrender.com

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

## Where Evidence Lives (everything in THIS repo — no Drive, no video)
| Path | Contents |
|------|----------|
| `agents/` | Real Hermes + OpenClaw configs (secrets redacted) |
| `agent-log.md` | The human → Hermes → OpenClaw loop |
| `sprints/` | One doc per sprint |
| `slack-export/` | Per-channel screenshots |
| `evidence/screenshots/` | App, agents-running, CI screenshots |
