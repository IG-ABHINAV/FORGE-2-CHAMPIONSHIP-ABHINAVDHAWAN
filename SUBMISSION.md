# Submission Checklist — Forge 2 / Edition 1 (PulseDesk)

Tick each and point to the in-repo path. Everything must be committed in THIS repo.

## Core Requirements

- [x] Repo is public, named `forge2-abhinavdhawan`
- [x] README has exact run steps; `php artisan migrate --seed` works from a fresh clone → [README.md](README.md)
- [x] Backend = Laravel 11 + MySQL → [backend/](backend/) ; Frontend = React 19 + Vite + Tailwind → [frontend/](frontend/)
- [x] Multi-tenancy: Org A cannot see Org B data (tenant derived from auth session, NOT client id) → [EnsureTenantScope.php](backend/app/Http/Middleware/EnsureTenantScope.php)
- [x] Hermes config committed (real, secrets redacted) → [agents/hermes/hermes-config.yaml](agents/hermes/hermes-config.yaml)
- [x] OpenClaw config committed (real, secrets redacted) → [agents/openclaw/openclaw.json](agents/openclaw/openclaw.json)
- [x] agent-log.md shows the real human→Hermes→OpenClaw loop → [agent-log.md](agent-log.md)
- [x] sprints/ has ≥ 2 sprint docs (we have 3) → [sprints/](sprints/)
- [x] Slack proof in slack-export/screenshots/ (per channel) → [slack-export/screenshots/](slack-export/screenshots/)
- [x] App / agents-running / CI screenshots in evidence/screenshots/ → [evidence/screenshots/](evidence/screenshots/)
- [x] .github/workflows/ci.yml present + green run on Actions tab → [.github/workflows/ci.yml](.github/workflows/ci.yml)
- [x] PRs merged by ME (human); commit authors are the agents
- [x] All model calls went through EastRouter → [agent-log.md](agent-log.md)

## Models Used (all via EastRouter)

| Model | Agent Role | Usage |
|-------|-----------|-------|
| `z-ai/glm-5.1` | OpenClaw (coder) | All coding, implementation, tests |
| `moonshotai/kimi-k2.6` | Hermes (PO/planner) | Sprint planning, task decomposition |
| `moonshotai/kimi-k2.7-code` | QA Reviewer | Code review, test verification |

## Live URL

**Backend API:** https://pulsedesk-backend-qsrr.onrender.com

## Sprint Summary

| Sprint | Tasks | Tests | Key Deliverables |
|--------|-------|-------|-----------------|
| Sprint 1 | T-01 → T-05 | 16 passing | Auth, CRUD, tenant isolation, SLA, activity log, frontend, CI |
| Sprint 2 | T-06 → T-10 | 21 passing | Seeder, dashboard, notifications, RBAC, rate limiting |
| Sprint 3 | T-11 → T-15 | 19 passing | Ticket detail, internal notes, search/filter, Render deploy |

## Bonus Agents (additional agents in the loop)

- [x] **QA Reviewer agent** (`moonshotai/kimi-k2.7-code`) — reviewed PRs, ran tests, checked tenant isolation → [agents/skills/qa-reviewer.yaml](agents/skills/qa-reviewer.yaml)
- [x] **CI/Deploy agent** (`z-ai/glm-5.1`) — automated build verification and deployment pipeline → [agents/skills/ci-deploy.yaml](agents/skills/ci-deploy.yaml)

## Evidence

All evidence is committed in THIS repo — no video, no Google Drive.
