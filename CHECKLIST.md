# Sentinels Robotics: Development Checklist

## All features completed

### Website pages (15)

- [x] `/` landing page (hero and 8 sections)
- [x] `/platform` platform overview
- [x] `/security` security features
- [x] `/developers` developer docs and SDK
- [x] `/pricing` 3-tier pricing
- [x] `/enterprise` enterprise features
- [x] `/blog` and `/blog/[slug]` blog with dynamic posts
- [x] `/docs` and `/docs/[slug]` documentation
- [x] `/auth/signin` sign-in page
- [x] `/dashboard` main dashboard
- [x] `/dashboard/robots` robot fleet list
- [x] `/dashboard/robots/[id]` robot detail
- [x] `/dashboard/realtime` live telemetry feed
- [x] `/dashboard/settings` API key management

### Design system

- [x] Light theme: industrial, monochrome, safety orange
- [x] shadcn/ui full component library
- [x] Framer Motion scroll animations
- [x] Responsive design with mobile nav

### Backend APIs: robot core (51 routes total)

- [x] Robot registration, CRUD, commands
- [x] Firmware verification (hash chain)
- [x] Telemetry verification (signed events)
- [x] Trust verification
- [x] Trust score engine (algorithm and factors)
- [x] Key rotation
- [x] Hardware attestation (TPM)
- [x] Anomaly detection, rule-based, 5 rules
- [x] AI analysis (statistical Z-score, moving average, pattern matching)
- [x] Robot wallet (balance, deposit/withdraw, permissions)
- [x] OTA software updates (create, list, status)

### Backend APIs: fleet and management

- [x] Fleet listing and stats (search, pagination, filters)
- [x] Audit logs (search, pagination, date range)
- [x] Solana proof anchoring
- [x] Solana-native blockchain support
- [x] IPFS storage (upload, retrieve, pin, stats)
- [x] ClickHouse telemetry (ingest, query, aggregates)
- [x] MQTT and NATS messaging (publish, subscribe)

### Backend APIs: business and platform

- [x] Stripe payment integration (checkout, webhook, status)
- [x] Role-based access control (admin, operator, viewer)
- [x] User management (CRUD, role assignment)
- [x] Organization and multi-tenant (orgs, members, roles)
- [x] API key management (generate, verify, revoke)
- [x] Webhook system (register, dispatch, HMAC signing)
- [x] Compliance export (CSV and JSON for audit, fleet, reports)
- [x] Email notifications (engine, settings, templates)
- [x] Robot-to-robot payments (transfer, stats, audit trail)

### Backend APIs: telemetry pipeline

- [x] Telemetry ingest (ClickHouse and Prisma dual-write)
- [x] Telemetry query (filters, pagination)
- [x] Telemetry aggregates (1m, 5m, 1h, 1d buckets)

### Database models (13)

- [x] Fleet
- [x] Robot
- [x] FirmwareRecord
- [x] TelemetryEvent
- [x] AuditLog
- [x] Command
- [x] Wallet
- [x] SoftwareUpdate
- [x] User
- [x] Webhook
- [x] Organization and OrgMember
- [x] Transaction

### Libraries and infrastructure

- [x] Ed25519 cryptography (keygen, sign, verify)
- [x] SHA-256 hashing and hash chains
- [x] Trust score engine (`src/lib/trust-score.ts`)
- [x] Anomaly detection (`src/lib/anomaly-detection.ts`)
- [x] AI analysis (`src/lib/ai-anomaly.ts`)
- [x] RBAC middleware (`src/lib/rbac.ts`)
- [x] Webhook dispatcher (`src/lib/webhooks.ts`)
- [x] Notification engine (`src/lib/notifications.ts`)
- [x] IPFS client (`src/lib/ipfs.ts`)
- [x] ClickHouse client (`src/lib/clickhouse.ts`)
- [x] Messaging broker (`src/lib/messaging.ts`)
- [x] Multi-chain abstraction (`src/lib/chains.ts`)
- [x] Stripe client (`src/lib/stripe.ts`)
- [x] Rate limiting (`src/lib/rate-limit.ts`)
- [x] Solana web3.js integration (`src/lib/solana.ts`)
- [x] InsForge SDK (`src/lib/insforge.ts`)

### i18n

- [x] English translations (`src/i18n/messages/en.json`)
- [x] next-intl config (`src/i18n/request.ts` and `config.ts`)
- [x] Ready for additional locales (drop JSON files in `src/i18n/messages/`)

### Integrations

- [x] Solana web3.js
- [x] InsForge SDK
- [x] WebSocket realtime hook
- [x] TanStack Query
- [x] Zustand
- [x] NextAuth
- [x] Prisma ORM

## Final stats

| Metric | Count |
|---|---|
| API routes | 51 |
| Pages | 15 |
| Database models | 13 |
| Library modules | 16 |
| Build status | passing |

## To activate when ready

- **Stripe:** install the `stripe` package and set `STRIPE_SECRET_KEY`.
- **IPFS:** swap the mock for a real IPFS node (Pinata or Infura).
- **ClickHouse:** swap the in-memory store for a real ClickHouse cluster.
- **MQTT and NATS:** swap the in-memory broker for a real MQTT or NATS client.
- **Anchor program:** build a custom Solana program instead of the Memo program.
- **Email:** connect a real email service (SendGrid or Resend).
