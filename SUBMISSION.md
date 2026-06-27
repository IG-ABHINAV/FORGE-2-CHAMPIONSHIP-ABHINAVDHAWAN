# Submission Checklist — Forge 2 / Edition 1 (PulseDesk)

Tick each and point to the in-repo path. Everything must be committed in THIS repo.

- [x] Repo is public, named `forge2-abhinavdhawan`
- [x] README has exact run steps; `php artisan migrate --seed` works from a fresh clone → [README.md](README.md)
- [x] Backend = Laravel 11 + MySQL → [backend/](backend/) ; Frontend = React 19 + Vite + Tailwind → [frontend/](frontend/)
- [x] Multi-tenancy: Org A cannot see Org B data (tenant derived from auth session) → [EnsureTenantScope.php](backend/app/Http/Middleware/EnsureTenantScope.php)
- [x] Hermes config committed → [agents/hermes/hermes-config.yaml](agents/hermes/hermes-config.yaml)
- [x] OpenClaw config committed → [agents/openclaw/openclaw.json](agents/openclaw/openclaw.json)
- [x] agent-log.md shows the real human→Hermes→OpenClaw loop → [agent-log.md](agent-log.md)
- [x] sprints/ has ≥ 2 sprint docs → [sprints/](sprints/)
- [x] Slack proof in slack-export/screenshots/ (per channel) → [slack-export/screenshots/](slack-export/screenshots/)
- [x] App / agents-running / CI screenshots in evidence/screenshots/ → [evidence/screenshots/](evidence/screenshots/)
- [x] .github/workflows/ci.yml present + a green run on the Actions tab → [.github/workflows/ci.yml](.github/workflows/ci.yml)
- [x] PRs merged by ME (human); commit authors are the agents
- [x] All model calls went through EastRouter → [agent-log.md](agent-log.md)
- [x] Models used: `z-ai/glm-5.1` (OpenClaw coding), `moonshotai/kimi-k2.6` (Hermes planning), `moonshotai/kimi-k2.7-code` (QA analysis)
- [x] Live URL: https://pulsedesk-backend-qsrr.onrender.com
- [x] Sprints run: 33 sprints, 145 tasks delivered
