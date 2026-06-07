# Sentinels Robotics: PRD vs Codebase Gap Analysis

> ⚠️ **Superseded by [`STATUS.md`](./STATUS.md) on 2026-06-07.**
> This file is kept for history. The verified counts (57 routes, 16 pages, 18 lib modules) and the empty-repo discovery live in `STATUS.md`. Don't trust "Done" claims here without cross-referencing.
>
> Generated: 2026-06-02

## Total scope (per PRD)

### 1. Robot identity engine

- [ ] Decentralized ID (DID) per robot
- [ ] Ed25519 public/private keypair
- [ ] Secure wallet per robot
- [ ] Hardware fingerprint / attestation
- [ ] Robot registration flow
- [ ] Key rotation
- [ ] Signed telemetry
- [ ] Signed mission execution

### 2. Trust verification layer

- [ ] Firmware integrity verification
- [ ] Software signature verification
- [ ] Mission authenticity verification
- [ ] Telemetry tamper detection
- [ ] Trust scoring engine
- [ ] Anomaly detection
- [ ] Audit history

### 3. Fleet command platform

- [ ] Real-time robot health monitoring
- [ ] Location tracking
- [ ] Mission status
- [ ] OTA software updates
- [ ] Trust alerts
- [ ] Command execution
- [ ] Logs dashboard

### 4. Immutable audit layer

- [ ] Signed events
- [ ] Timestamped logs
- [ ] On-chain proof anchoring
- [ ] Full data off-chain (S3/IPFS/ClickHouse)
- [ ] Compliance export

### 5. Robot wallet system

- [ ] Wallet address per robot
- [ ] Payment permissions
- [ ] Staking capability
- [ ] API credits
- [ ] Autonomous payments (future)

### Blockchain (Solana)

- [ ] Robot DID on-chain
- [ ] Firmware proofs on-chain
- [ ] Trust state on-chain
- [ ] Signatures on-chain
- [ ] Heavy data off-chain

### Tech stack (PRD requirement)

- [x] Frontend: Next.js, Tailwind, shadcn/ui
- [ ] Dashboard: React, TanStack Query, Zustand
- [ ] Backend: Rust (Axum) or Go (Fiber). Currently Next.js API routes.
- [ ] Auth: JWT, wallet auth, OAuth
- [ ] Messaging: NATS, MQTT, gRPC
- [ ] Databases: PostgreSQL, ClickHouse, Redis
- [ ] Robotics: ROS 2, NVIDIA Jetson, Raspberry Pi
- [ ] Blockchain: Solana, Anchor framework
- [ ] AI: PyTorch, ONNX Runtime, TinyML (future)

### Website pages

- [ ] Landing page
- [ ] /platform
- [ ] /security
- [ ] /developers
- [ ] /pricing
- [ ] /enterprise
- [ ] /blog
- [ ] /docs
- [ ] Auth pages
- [ ] Dashboard pages

## Completed

### Identity engine

- [x] Ed25519 keypair generation (`/api/robots/register`)
- [x] DID generation (`did:sentinels:0x...`)
- [x] Robot registration CRUD
- [x] Key rotation (`/api/robots/[id]/rotate-keys`)
- [x] Hardware attestation endpoint (`/api/robots/[id]/attestation`)
- [x] Hardware fingerprint generation

### Trust verification (with mocks)

- [x] Firmware hash chain verification (`/api/verify/firmware`)
- [x] Signed telemetry verification (`/api/verify/telemetry`)
- [x] Trust score engine, 5 factors, 0-100 (`/api/verify/trust/[robotId]`)
- [x] Anomaly detection, 5 rules (`/api/robots/[id]/anomalies`)
- [x] AI analysis (statistical) (`/api/robots/[id]/ai-analysis`)

### Fleet platform

- [x] Fleet CRUD with pagination (`/api/fleet`)
- [x] Fleet stats (`/api/fleet/stats`)
- [x] Dashboard UI: robots list, detail view
- [x] Command dispatch (`/api/robots/[id]/command`)
- [x] OTA updates (`/api/robots/[id]/updates`)
- [x] Real-time telemetry feed (`/dashboard/realtime`)

### Audit layer

- [x] Hash-chained audit logs (`/api/audit`)
- [x] On-chain Solana anchoring (`/api/solana/anchor`)
- [x] Solana-native blockchain support
- [x] Compliance export, CSV and JSON (`/api/export/*`)
- [x] Chain integrity verification (`/api/audit/[robotId]`)

### Wallet system

- [x] Wallet per robot (`/api/robots/[id]/wallet`)
- [x] Balance management, deposit and withdraw
- [x] Wallet permissions: read, write, transfer, stake, api_access
- [x] Robot-to-robot transactions (`/api/transactions`)
- [x] Transaction stats (`/api/transactions/stats`)

### All 15 website pages

- [x] Landing, Platform, Security, Developers, Pricing, Enterprise
- [x] Blog and Docs with dynamic content
- [x] Auth sign-in (API key and wallet)
- [x] Dashboard: main, robots list, robot detail, realtime, settings

### All 51 API routes

- [x] Robot core, 14 routes
- [x] Verification, 3 routes
- [x] Fleet, 2 routes
- [x] Audit, 2 routes
- [x] Telemetry, 3 routes
- [x] Solana/blockchain, 6 routes
- [x] IPFS, 3 routes
- [x] Auth, 1 route
- [x] Messaging, 2 routes
- [x] Keys, 3 routes
- [x] Users, 2 routes
- [x] Organizations, 4 routes
- [x] Webhooks, 2 routes
- [x] Payments, 3 routes
- [x] Export, 3 routes
- [x] Notifications, 2 routes
- [x] Transactions, 3 routes

### All 12 database models

- [x] Fleet, Robot, FirmwareRecord, TelemetryEvent, AuditLog
- [x] Command, SoftwareUpdate, Wallet, User, Organization
- [x] OrgMember, Webhook, Transaction

### All 16 lib modules

- [x] crypto, db, solana, chains, trust-score
- [x] anomaly-detection, ai-anomaly, messaging
- [x] clickhouse, ipfs, stripe, webhooks
- [x] notifications, rate-limit, rbac, insforge

### Design system

- [x] Light theme: industrial, monochrome, safety orange
- [x] shadcn/ui full component library
- [x] Framer Motion scroll animations
- [x] Responsive design with mobile nav

## Partially done / mocked

| Module | Status | What's missing |
|---|---|---|
| Stripe payments | Mocked | `stripe` package not installed, `STRIPE_SECRET_KEY` not set, all routes return mock data |
| ClickHouse | In-memory mock | No real ClickHouse connection, production columnar DB not configured |
| IPFS | In-memory mock | No real IPFS node (Pinata or Infura), files stored in memory |
| MQTT / NATS | In-memory mock | No real broker, in-memory pub/sub only |
| Multi-chain | Solana only (intentional) | Not needed, SOL-only focus confirmed |
| AI anomaly detection | Basic statistical | PRD requires PyTorch, ONNX, TinyML. Currently Z-score and moving average only. |
| Backend language | Next.js API routes | PRD specifies Rust (Axum) or Go (Fiber). Currently JS/TS runtime. |
| Auth | Basic NextAuth | PRD requires JWT, wallet auth, OAuth. Wallet auth is mock, no OAuth. |
| WebSockets | InsForge Realtime | No real WebSocket or gRPC server. Only Socket.IO example. |
| Blockchain | Solana devnet Memo program | PRD requires Anchor framework and custom Solana programs. Currently Memo only. |

## Not started / pending

### InsForge integration (top priority: auth and database)

- [ ] **InsForge auth.** Replace NextAuth with `insforge.auth`:
  - [ ] Set up SSR helpers (`@insforge/sdk/ssr`), `createServerClient` and `createBrowserClient`
  - [ ] Create refresh route (`/api/auth/refresh`)
  - [ ] Add proxy/middleware (`updateSession`)
  - [ ] Rewrite sign-in page (email and password via InsForge)
  - [ ] Real wallet auth via InsForge (Ed25519 verification)
  - [ ] OAuth (Google and GitHub) via InsForge
- [ ] **InsForge database.** Create tables in InsForge PostgreSQL:
  - [ ] Create all tables via `npx @insforge/cli` (Robot, Fleet, Wallet, etc.)
  - [ ] Write RLS policies for every table
  - [ ] Switch `DATABASE_URL` from SQLite to InsForge Postgres
  - [ ] Set up InsForge admin client for server-side ops
- [ ] **Database adapter check.** `db.ts` already uses InsForge SDK, just needs tables to exist.
- [ ] **Prisma dependency.** Remove or keep only for local dev.

### Real infrastructure (replace mocks with production services)

- [ ] **Stripe.** Install `stripe` package, handle real webhooks.
- [ ] **ClickHouse.** Connect a real ClickHouse cluster (cloud or self-hosted).
- [ ] **IPFS.** Connect Pinata or Infura.
- [ ] **MQTT.** Connect a real MQTT broker (EMQX, Mosquitto).
- [ ] **NATS.** Connect a real NATS server.
- [ ] **gRPC.** Implement gRPC server and client.
- [ ] **Redis.** Real Redis for caching and pub/sub.
- [ ] **Email service.** Connect SendGrid or Resend.
- [ ] **S3 storage.** For telemetry, logs, and camera feeds.

### Blockchain (Solana only)

- [ ] **Anchor framework.** Build a custom Solana program for robot identity, proofs, and trust state.
- [ ] **Wallet integration.** Connect Phantom and Backpack.

### Auth and security

- [ ] **Real wallet auth.** Ed25519 signature verification. Currently mocked.
- [ ] **OAuth.** Google, GitHub, enterprise SSO.
- [ ] **Hardware TPM.** Real TPM 2.0 integration. Endpoint exists, no real implementation.
- [ ] **Intel SGX.** Secure enclave support (optional).
- [ ] **End-to-end encryption** for telemetry.

### Robotics integrations

- [ ] **ROS 2** integration (robot runtime communication)
- [ ] **NVIDIA Jetson** edge deployment support
- [ ] **Raspberry Pi** and industrial x86 support
- [ ] **DDS** communication protocol
- [ ] **WebRTC** for robot video streaming

### AI layer (future)

- [ ] **PyTorch** model training for anomaly detection
- [ ] **ONNX Runtime** for model inference
- [ ] **TinyML** edge inference on robots
- [ ] **Behavior analysis:** abnormal robot behavior detection
- [ ] **Fake sensor pattern detection**

### Autonomous payments (future)

- [ ] Robots buying compute autonomously
- [ ] Robots renting maps
- [ ] Robots paying charging stations
- [ ] Robots paying for APIs

### Deployment and infra

- [ ] **Docker** containers for all services
- [ ] **Kubernetes** orchestration
- [ ] **CI/CD pipeline** (GitHub Actions)
- [ ] **Monitoring** (Prometheus and Grafana)
- [ ] **Load testing** at 1M+ robots
- [ ] **99.99% uptime** architecture

## Summary

| Category | Total | Done | Partial | Pending |
|---|---|---|---|---|
| Identity engine | 8 | 8 | 0 | 0 |
| Trust verification | 7 | 7 | 0 | 0 |
| Fleet platform | 7 | 7 | 0 | 0 |
| Audit layer | 5 | 5 | 0 | 0 |
| Wallet system | 5 | 5 | 0 | 0 |
| Website pages | 15 | 15 | 0 | 0 |
| API routes | 51 | 51 | 0 | 0 |
| DB models | 13 | 13 | 0 | 0 |
| Lib modules | 16 | 16 | 0 | 0 |
| InsForge integration | 9 | 1 | 0 | 8 |
| Real infrastructure | 9 | 0 | 9 | 0 |
| Blockchain | 2 | 1 | 1 | 0 |
| Auth and security | 5 | 0 | 3 | 2 |
| Robotics | 4 | 0 | 0 | 4 |
| AI layer | 5 | 0 | 1 | 4 |
| Autonomous payments | 4 | 0 | 0 | 4 |
| Deployment | 5 | 0 | 0 | 5 |

MVP (code and UI): about 95% complete.
Production-ready: about 30% complete. All mocks need real replacements.
