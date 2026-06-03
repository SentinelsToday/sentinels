# Sentinels

Trust infrastructure for autonomous machines. Every robot gets a cryptographic identity, signed telemetry, firmware verification, an audit trail, and a wallet.

Built with Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma (SQLite), and Solana Web3.

## What it does

- **Robot Identity** — Ed25519 keypairs, DIDs, hardware attestation, key rotation
- **Trust Verification** — firmware hash chains, telemetry signing, trust scoring, anomaly detection
- **Fleet Management** — real-time dashboard, command execution, software updates
- **Audit Layer** — hash-linked immutable logs, on-chain Solana anchoring, compliance export
- **Robot Wallets** — Solana wallets per robot, programmable permissions, autonomous payments
- **Blockchain** — Solana proof verification, anchor transactions
- **Telemetry Pipeline** — ingest, query, aggregates (ClickHouse + Prisma dual-write)
- **Platform** — organizations, RBAC, API keys, webhooks, Stripe payments, notifications

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| State | TanStack React Query 5 |
| Auth | NextAuth 4 + InsForge |
| Database | Prisma ORM (SQLite) |
| Blockchain | Solana Web3.js, Ed25519 |
| Storage | IPFS |
| Payments | Stripe |
| i18n | next-intl |
| Animations | Framer Motion |
| Deployment | Vercel (standalone) |

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── api/                  # 51 API routes
│   ├── auth/signin           # Sign-in page
│   ├── blog/                 # Blog pages
│   ├── dashboard/            # Fleet dashboard
│   ├── developers/           # SDK docs
│   ├── docs/                 # Documentation hub
│   ├── enterprise/           # Enterprise features
│   ├── platform/             # Platform overview
│   ├── pricing/              # Pricing page
│   └── security/             # Security features
├── components/
│   ├── ui/                   # 48 shadcn/ui components
│   └── sentinels/            # Marketing section components
├── lib/                      # Library modules (crypto, solana, ipfs, etc.)
├── hooks/                    # Custom hooks
└── i18n/                     # Translations
```

## Running locally

```bash
cp .env.example .env   # configure DATABASE_URL etc.
npm install
npx prisma db push     # creates SQLite database
npm run dev            # starts on http://localhost:3000
```

## API routes (51 total)

The API covers robot CRUD, firmware verification, telemetry signing, trust scoring, wallet management, fleet stats, audit logs, Solana anchoring, IPFS storage, Stripe payments, webhooks, organizations, users, API keys, and compliance export.

See `/docs` for full documentation.

## Build

```bash
npm run build
```

Produces a standalone `.next/standalone/` output for deployment.

## Status

Working build. Some integrations (Stripe, ClickHouse, MQTT, real IPFS) use mocks by default — see `CHECKLIST.md` for activation steps.
