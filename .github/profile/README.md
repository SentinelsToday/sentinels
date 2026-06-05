![sentinel-labs-banner](https://raw.githubusercontent.com/SentinelLabs/.github/main/assets/banner-dark.svg)

## Mission

Build the trust infrastructure for autonomous systems. Sentinel Labs develops open-core software for identity, attestation, telemetry, and secure communication between robots, AI agents, and the cloud.

## About

Sentinel Labs is an infrastructure company. We build the layer between hardware and cloud that verifies identity, establishes trust, and enables auditable machine-to-machine communication at scale.

Our work spans:

- **Device identity** -- cryptographic attestation for robotic hardware
- **Trust scoring** -- real-time reputation systems for autonomous agents
- **Audit trails** -- tamper-evident logs for every machine action
- **Agent communication** -- signed, verified message passing between heterogeneous systems
- **Blockchain anchoring** -- optional Solana-based attestation for cross-organizational trust

We are not a robotics company. We are the infrastructure that robotics companies run on.

## Ecosystem

| Layer | Repository | Description |
|---|---|---|
| Core | `sentinel-core` | Trust engine, attestation server, identity registry |
| Agent | `sentinel-agent` | On-device daemon for identity, telemetry, update management |
| Cloud | `sentinel-cloud` | Management API, dashboard backend, fleet orchestration |
| Chain | `sentinel-chain` | Solana anchor programs for on-chain attestation |
| SDK | `sentinel-sdk` | Language SDKs (TypeScript, Rust, Python) |
| Firmware | `sentinel-firmware` | Reference TPM/secure-enclave firmware for robot controllers |
| Dashboard | `sentinel-dashboard` | Web UI for fleet management, real-time monitoring, audit export |
| Docs | `sentinel-docs` | Fumadocs-based documentation portal |
| CLI | `sentinel-cli` | Command-line tool for fleet ops, key management, deployment |
| Mobile | `sentinel-mobile` | On-call companion for robot operators |

## Technology Stack

- **Runtime**: Rust (core engine), TypeScript/Node (cloud), Python (ML pipelines)
- **Database**: PostgreSQL / ClickHouse (time-series telemetry)
- **Blockchain**: Solana (Anchor framework for attestation programs)
- **Protocol**: gRPC, MQTT, NATS (device communication)
- **Auth**: Ed25519, TPM 2.0, secure enclave integration
- **Infrastructure**: Linux, systemd, containers (Docker)

## Repositories

### Core Infrastructure

| Repository | Description | Language |
|---|---|---|
| sentinel-core | Trust engine, attestation, identity registry | Rust |
| sentinel-agent | On-device daemon for identity management | Rust |
| sentinel-cloud | Fleet management API and backend services | TypeScript |
| sentinel-chain | Solana Anchor programs for on-chain attestation | Rust |

### Developer Tools

| Repository | Description | Language |
|---|---|---|
| sentinel-sdk | Multi-language SDK bindings | Rust, TS, Python |
| sentinel-cli | Command-line fleet management tool | Rust |
| sentinel-dashboard | Web UI for fleet operations | TypeScript |
| sentinel-mobile | iOS/Android operator companion | Kotlin, Swift |

### Firmware & Hardware

| Repository | Description | Language |
|---|---|---|
| sentinel-firmware | Reference TPM firmware for robot controllers | C, Rust |
| sentinel-hardware | Hardware reference designs and CAD files | KiCad, STEP |

### Documentation

| Repository | Description |
|---|---|
| sentinel-docs | Fumadocs-based documentation portal (MDX) |
| sentinel-website | Company website and marketing site |

## Developer Resources

- **Documentation**: [docs.sentinellabs.io](https://docs.sentinellabs.io)
- **API Reference**: [docs.sentinellabs.io/api](https://docs.sentinellabs.io/api)
- **CLI Reference**: [docs.sentinellabs.io/cli](https://docs.sentinellabs.io/cli)
- **SDK Reference**: [docs.sentinellabs.io/sdk](https://docs.sentinellabs.io/sdk)
- **Guides**: [docs.sentinellabs.io/guides](https://docs.sentinellabs.io/guides)

## Community

- **Discord**: [discord.gg/sentinellabs](https://discord.gg/sentinellabs)
- **Twitter/X**: [@sentinellabs](https://twitter.com/sentinellabs)
- **GitHub Discussions**: [github.com/orgs/SentinelLabs/discussions](https://github.com/orgs/SentinelLabs/discussions)
- **Stack Overflow**: Use tag `sentinellabs`

## Open Source Philosophy

Sentinel Labs is built on an open-core model:

- **Core engine** (`sentinel-core`, `sentinel-agent`, `sentinel-sdk`) -- Apache 2.0
- **Cloud platform** (`sentinel-cloud`, `sentinel-dashboard`) -- source-available (BSL)
- **Documentation** (`sentinel-docs`) -- CC-BY-4.0
- **Reference firmware** (`sentinel-firmware`) -- MIT

We believe trust infrastructure must be auditable. All cryptographic code is open source. Enterprise features (multi-cluster, SSO, audit compliance exports) are available under the BSL license with a three-year conversion to Apache 2.0.

## Security

Report vulnerabilities to [security@sentinellabs.io](mailto:security@sentinellabs.io). PGP key available in each repository's SECURITY.md.

---

2025 Sentinel Labs. Trust infrastructure for autonomous systems.
