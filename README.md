# Sentinels

Trust infrastructure for autonomous machines.

- Website: <https://sentinels.today>
- Org: <https://github.com/Sentinels-Today>
- Status: Pre-alpha

## What lives here

This repo is the **`sentinels` monorepo** — it bundles the marketing website, the cloud API, and the operator dashboard into one Next.js 16 app. As individual modules harden, they will split out into the standalone `sentinel-*` sibling repos under the org.

```
src/app                  Next.js 16 app router
  /                      Marketing site (16 pages, light theme)
  /dashboard             Operator fleet UI
  /api/...               57 route files (REST surface)
src/lib                  Trust engine, crypto, integrations (18 modules)
src/components/sentinels Landing page sections
db/                      Local SQLite (dev) — InsForge Postgres in prod
```

## Read these first

| File | Purpose |
|---|---|
| [`STATUS.md`](./STATUS.md) | **Verified** state — what's built, what's mocked, what's missing. Single source of truth. |
| [`PRD.md`](./PRD.md) | Product vision and MVP scope. |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Layered system design and target stack. |
| [`ROADMAP.md`](./ROADMAP.md) | Quarterly milestones. |
| [`GAP-ANALYSIS.md`](./GAP-ANALYSIS.md) | ⚠️ Historical — superseded by `STATUS.md`. |
| [`CHECKLIST.md`](./CHECKLIST.md) | ⚠️ Historical — superseded by `STATUS.md`. |

## Quick start

```bash
bun install
bun dev          # next dev on :3000
bun run lint
bun run build    # produces .next/standalone
```

Environment template in [`.env.example`](./.env.example). Local secrets go in `.env.local` (gitignored).

## Ecosystem repos

The standalone `sentinel-*` repos at <https://github.com/Sentinels-Today> are currently scaffolded with docs only; their source will land as each module is extracted from this monorepo. Track per-milestone status in `ROADMAP.md`.

## License

Apache 2.0 — see [`LICENSE`](./LICENSE).
