# Sentinels — Verified Project Status

> Generated: 2026-06-07 by code inspection + GitHub API verification.
> Supersedes claims in `GAP-ANALYSIS.md` (which is now historical).

This file is the **single source of truth** for what is actually built, what is mocked, and what is missing. Numbers and "Done" claims here were verified directly against the codebase, not copied from older docs.

---

## tl;dr

| Slice | Reality |
|---|---|
| Marketing site + dashboard UI | ✅ Built — 16 pages, light theme, 10 landing sections |
| API surface | ✅ Built — **57** route files (older docs said 51; waitlist + extras added) |
| Backend logic | ⚠️ Built in TS, **not Rust** as PRD specifies |
| Database | ⚠️ Local **SQLite** via Prisma — InsForge Postgres tables not yet created |
| Auth | ✅ Wallet auth (Ed25519 + nonce challenge) and API key both work. OAuth pending. |
| Solana | ⚠️ Uses **SPL Memo program**, not a custom Anchor program |
| Stripe / IPFS / ClickHouse / MQTT / NATS | ❌ All fall back to **in-memory mocks** — verified in code. **Stripe removed entirely**; replaced by Solana Subscriptions (see below). |
| `sentinel-*` GitHub repos | ❌ **All 10 are empty shells** — only `.github/`, README, ARCHITECTURE, LICENSE. Despite ROADMAP marking them "Released". |
| Solana Subscriptions | 🟡 SDK wired (`@solana/subscriptions` + `@solana/kit`). `/api/subscriptions/plans` and `/me` live, devnet config in place. UI on pricing page calls plans API. On-chain plans not yet provisioned — needs `MERCHANT_PRIVATE_KEY` + `scripts/create-plans.ts` to fire actual `createPlan` tx (script currently dry-runs). |
| Robot agent / firmware / SDKs / CLI | ❌ **Zero code** — only repo placeholders |
| Docker / CI / monitoring | ❌ Caddyfile exists; nothing else |
| Pump.fun token | ✅ Live, address shown in popup |

**MVP demo state:** site looks shipped, API responds, dashboards render. **Production readiness:** ~25%, because almost every external integration is a mock fallback.

---

## What's actually built (verified)

### Frontend (16 pages — was claimed 15)

`page.tsx` files found under `src/app`:

```
/                          (10 sections: Hero, RobotIdentity, Telemetry,
                            Firmware, Fleet, Enterprise, Developer, Pricing,
                            Tokonomics, CTA)
/auth/signin              (waitlist form, not real auth)
/blog, /blog/[slug]
/dashboard
/dashboard/realtime
/dashboard/robots
/dashboard/robots/[id]
/dashboard/settings
/developers
/docs, /docs/[slug]
/enterprise
/platform
/pricing
/security
```

Theme: light, white background, `#111113` text, `#E8553D` safety orange accent. shadcn/ui + Framer Motion + Tailwind v4.

### API routes (57 — was claimed 51)

Counted: `find src/app/api -name "route.ts" | wc -l` → 57.

Top-level groups: `audit`, `auth`, `chains`, `export`, `fleet`, `ipfs`, `keys`, `messaging`, `notifications`, `orgs`, `payments`, `robots`, `solana`, `telemetry`, `transactions`, `users`, `verify`, `webhooks`, `waitlist`.

New since GAP-ANALYSIS: `waitlist/` (recent feature).

### Lib modules (18, was 16)

`ai-anomaly`, `anomaly-detection`, `blog-data`, `chains`, `clickhouse`, `crypto`, `db`, `docs-data`, `insforge`, `ipfs`, `messaging`, `notifications`, `rate-limit`, `rbac`, `solana`, `stripe`, `trust-score`, `utils`.

### Solana (real, but minimal)

- `@solana/web3.js` wired
- Anchoring goes through **SPL Memo program** (not a custom program)
- Devnet by default
- Live SENT token referenced on site (pump.fun)

### Recent product decisions visible in git

- `2739e53` feat: add 20% SENT discount banner to pricing pages
- `d1fdc6a` Add pump token address and update project files
- `661d37b` feat: add token popup with copy and solscan link
- `09f36ab` feat: add live token address to tokonomics section
- `79720df` feat: replace wallet auth with waitlist flow on sign-in page

---

## What's mocked (verified by reading the lib files)

Every adapter detects whether a real backend is configured by checking an env var. If unset → in-memory fallback. If set → currently **throws `not yet implemented`** (Pinata/ClickHouse/MQTT/NATS).

| Adapter | Env var checked | Behavior when set | Behavior when unset |
|---|---|---|---|
| `lib/stripe.ts` | `STRIPE_SECRET_KEY` | tries `require('stripe')` — package **not in `package.json`**, so returns `null` | returns `null` (mock mode) |
| `lib/ipfs.ts` | `IPFS_GATEWAY_URL` | throws "Real IPFS not yet implemented" | in-memory `Map<cid, data>` |
| `lib/clickhouse.ts` | `CLICKHOUSE_HOST` | throws "Real ClickHouse not yet implemented" | in-memory array |
| `lib/messaging.ts` (MQTT) | `MQTT_BROKER_URL` | warns + falls back to in-memory pub/sub | in-memory pub/sub |
| `lib/messaging.ts` (NATS) | `NATS_SERVER_URL` | warns + falls back to in-memory pub/sub | in-memory pub/sub |
| `lib/chains.ts` | n/a — only Solana, others return `mock_*` txId | n/a | n/a |

These are **fail-safe scaffolds** — the API surface is real; the integration is not.

---

## What's missing entirely (zero code)

### 1. Sibling GitHub repos — empty

All 10 repos at <https://github.com/orgs/Sentinels-Today/repositories> exist but contain only **boilerplate docs** (sizes are 16–17 KB total — that's the README + ARCHITECTURE + LICENSE + .github/):

```
sentinel-core       sentinel-cloud      sentinel-chain
sentinel-agent      sentinel-dashboard  sentinel-sdk
sentinel-cli        sentinel-docs       sentinel-firmware
sentinel-website
```

ROADMAP.md marks several as "Released" — that is **incorrect**. They are placeholders.

### 2. Edge / on-device

- No ROS 2 integration
- No NVIDIA Jetson, RPi5, or x86 deployment binary
- No DDS / WebRTC code
- No TPM 2.0 attestation, no Intel SGX

### 3. SDKs & CLI

- No TypeScript SDK published
- No Rust SDK
- No Python SDK
- No `sentinel-cli` binary

### 4. AI layer (per PRD, deferred)

- No PyTorch / ONNX / TinyML
- Current "AI analysis" is statistical (Z-score, moving average)

### 5. Production ops

- No Dockerfile (Caddyfile only)
- No docker-compose for local stack
- No `.github/workflows/ci.yml`
- No Prometheus / Grafana / Sentry / Highlight
- No load testing
- 99.99% uptime claim is aspirational only

---

## What needs fixing (correctness, not features)

- [ ] `GAP-ANALYSIS.md` — fix "51 routes" → 57, "15 pages" → 16, mark sibling repos as **empty**, not "released".
- [ ] `ROADMAP.md` — change Q2 2025 statuses from "Released" to "Planned" for `sentinel-core`, `sentinel-agent`, `sentinel-chain`, `sentinel-dashboard`, `sentinel-sdk`, `sentinel-cli` until code lands.
- [ ] `CHECKLIST.md` — same — claims `sentinel-sdk` and `sentinel-cli` shipped; they have not.
- [ ] `.env.example` — add the missing prod env vars: `IPFS_GATEWAY_URL`, `IPFS_API_KEY` (Pinata), `CLICKHOUSE_HOST`, `CLICKHOUSE_USER`, `CLICKHOUSE_PASSWORD`, `MQTT_BROKER_URL`, `NATS_SERVER_URL`, `REDIS_URL`, `SENDGRID_API_KEY` / `RESEND_API_KEY`, `SENTRY_DSN`.

---

## Build order recommendation

Ranked by user value × distance from done:

1. **Polish landing page** (Task #7) — visible to every visitor, almost there.
2. **InsForge schema + RLS** (Task #6) — unblocks real persistence; SQLite → Postgres.
3. **Real auth** (Task #5) — wallet auth + OAuth so the dashboard is usable.
4. **Wire one real integration** (Task #3) — recommend **Pinata IPFS first** (small surface, big credibility win for "immutable audit"). Then Stripe (revenue).
5. **Anchor program** (Task #4) — replaces Memo program; deploy to devnet first.
6. **TS SDK** (Task #9) — wrap existing API; ship to npm as `@sentinels/sdk`.
7. **Sentinel-agent MVP** (Task #8) — Rust binary that registers + heartbeats. This is the moat.
8. **Populate sibling repos** (Task #2) — once code exists, move it from the monorepo or symlink via git subtree.
9. **CI + Docker + monitoring** (Task #10) — needed before any paying customer.
10. **Audit doc cleanup** (Task #1) — write `STATUS.md` (this file) into the project and reference it from README. **← already done by writing this.**

Tracked in the harness task list (`TaskList` to view).
