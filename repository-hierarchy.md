# Repository Hierarchy

## Organization: Sentinels

### Core Infrastructure

| # | Repository | Visibility | Description | Language | License |
|---|---|---|---|---|---|
| 1 | sentinel-core | Public | Trust engine, attestation, identity, trust scoring, audit | Rust | Apache-2.0 |
| 2 | sentinel-agent | Public | On-device daemon for identity, telemetry, updates | Rust | Apache-2.0 |
| 3 | sentinel-cloud | Public | Fleet management API, auth, webhooks, billing | TypeScript | BSL-1.1 |
| 4 | sentinel-chain | Public | Solana Anchor attestation programs | Rust | Apache-2.0 |

### Developer Tools

| # | Repository | Visibility | Description | Language | License |
|---|---|---|---|---|---|
| 5 | sentinel-sdk | Public | Multi-language SDK (TS, Rust, Python) | Multi | Apache-2.0 |
| 6 | sentinel-cli | Public | CLI for fleet operations | Rust | Apache-2.0 |
| 7 | sentinel-dashboard | Public | Web UI for fleet management | TypeScript | BSL-1.1 |
| 8 | sentinel-mobile | Private | iOS/Android companion | Kotlin/Swift | Proprietary |

### Firmware & Hardware

| # | Repository | Visibility | Description | Language | License |
|---|---|---|---|---|---|
| 9 | sentinel-firmware | Public | Reference TPM firmware | C/Rust | MIT |
| 10 | sentinel-hardware | Public | Hardware reference designs | KiCad | CC-BY-SA |

### Documentation

| # | Repository | Visibility | Description | Language | License |
|---|---|---|---|---|---|
| 11 | sentinel-docs | Public | Fumadocs documentation portal | MDX | CC-BY-4.0 |
| 12 | sentinel-website | Public | Company and marketing site | TypeScript | Proprietary |

### Internal (Private)

| # | Repository | Description |
|---|---|---|
| 13 | .github | Organization profile, templates, CI |
| 14 | sentinel-infra | Internal infrastructure (Terraform, k8s) |
| 15 | sentinel-benchmarks | Performance benchmarks |
| 16 | sentinel-security | Security audits and docs |

---

## Topic Tags

Each public repository should have the following topics:

| Topic | Applies To |
|---|---|
| `robotics` | All core, agent, firmware |
| `security` | Core, chain, firmware |
| `rust` | Core, agent, chain, cli, firmware |
| `typescript` | Cloud, dashboard, sdk |
| `solana` | Chain |
| `blockchain` | Chain |
| `iot` | Agent, firmware |
| `trust` | Core, agent |
| `identity` | Core, agent |
| `attestation` | Core, agent, firmware |
| `devops` | Cloud, cli |
| `documentation` | Docs |

---

## Repository Standards

Every repository must have:

- README.md with:
  - Description
  - Quick start
  - Build instructions
  - Test instructions
  - Configuration reference
- LICENSE file
- CONTRIBUTING.md (link to organization-wide guide)
- SECURITY.md (link to organization-wide guide)
- CODE_OF_CONDUCT.md (link to organization-wide guide)
- .gitignore
- CHANGELOG.md (auto-generated from conventional commits)
- CI configuration (.github/workflows)
- Issue templates
- Pull request template

## Suggested Repository Topics

sentinel-core: robotics, security, rust, trust, identity, attestation, embedded
sentinel-agent: robotics, rust, iot, embedded, trust, device-management
sentinel-cloud: robotics, typescript, api, fleet-management, backend
sentinel-chain: solana, blockchain, rust, attestation, anchor
sentinel-sdk: typescript, rust, python, sdk, robotics
sentinel-cli: rust, cli, devops, robotics
sentinel-dashboard: typescript, nextjs, react, robotics, fleet-management
sentinel-mobile: kotlin, swift, mobile, robotics
sentinel-firmware: c, rust, embedded, tpm, firmware, iot
sentinel-hardware: kicad, hardware, robotics, embedded
sentinel-docs: documentation, mdx, fumadocs
sentinel-website: typescript, nextjs, website
