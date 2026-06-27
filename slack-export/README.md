# Slack Export — PulseDesk · Forge 2

This directory contains evidence of the multi-agent Slack workspace used during the hackathon.

## Channels Used (All 5 Required)

| Channel | Purpose | Bot(s) Active |
|---------|---------|---------------|
| `#sprint-main` | Sprint planning, task assignment, completion reports | Hermes (PO), OpenClaw (Dev) |
| `#agent-coder` | OpenClaw code deliverables, PR summaries, task completion | OpenClaw (Dev), Hermes (Review) |
| `#agent-log` | EastRouter API call logs, token usage, spend tracking | OpenClaw (Dev) |
| `#ci-cd` | Test results, build logs, migration status, deployment | OpenClaw (Dev) |
| `#human-review` | Sprint review gates, human PO approvals, security checks | Hermes (PO) |

## Evidence Format

Per-channel screenshots are in `screenshots/` showing real agent activity:
- `sprint-main-01.png` — Sprint planning thread with Hermes + OpenClaw
- `agent-coder-01.png` — OpenClaw task deliverables
- `agent-log-01.png` — EastRouter API call logs
- `ci-cd-01.png` — Test results and build logs
- `human-review-01.png` — Human PO approval gates

All messages are genuine bot posts from Hermes and OpenClaw via Slack Web API.
No messages were deleted or edited post-hoc.
