# Open Source Strategy

## Philosophy

Sentinel Labs follows an **open-core** model. The core trust infrastructure is fully open source. Enterprise features are source-available under a delayed-license conversion (BSL to Apache 2.0 after 3 years).

We believe:

- **Trust infrastructure must be auditable.** Cryptographic code, identity protocols, and attestation logic must be open for independent review.
- **Open source drives adoption.** Developers and organizations adopt infrastructure they can inspect, modify, and deploy themselves.
- **Commercial sustainability enables long-term investment.** Enterprise features and support generate revenue that funds ongoing development of the open core.

## Licensing Model

| Component | License | Rationale |
|---|---|---|
| sentinel-core | Apache 2.0 | Core trust engine -- must be auditable |
| sentinel-agent | Apache 2.0 | On-device daemon -- must be auditable |
| sentinel-sdk | Apache 2.0 | Developer tooling -- broad adoption |
| sentinel-cli | Apache 2.0 | Developer tooling -- broad adoption |
| sentinel-chain | Apache 2.0 | Blockchain programs -- must be auditable |
| sentinel-firmware | MIT | Hardware reference -- permissive |
| sentinel-hardware | CC-BY-SA | Hardware designs -- share-alike |
| sentinel-cloud | BSL 1.1 | Enterprise features -- commercial |
| sentinel-dashboard | BSL 1.1 | Enterprise features -- commercial |
| sentinel-docs | CC-BY-4.0 | Documentation |
| sentinel-mobile | Proprietary | Companion apps |

### BSL Terms

- Change date: 3 years from release
- Additional usage grant: Production use of up to 10 robots is free
- License converts to Apache 2.0 after change date

## Contributor Strategy

### Who We Want to Attract

- **Embedded systems engineers** -- Rust, firmware, TPM, secure enclaves
- **Security researchers** -- Cryptography, attestation, audit systems
- **Robotics engineers** -- ROS, real-time systems, fleet operations
- **Backend engineers** -- Distributed systems, API design, databases
- **DevOps engineers** -- Deployment, monitoring, Kubernetes

### How We Attract Them

- Well-documented, well-tested code
- Clear good-first-issue labels with mentorship
- Architecture decision records (ADRs)
- Public roadmap with community input
- Regular release cadence

### Contributor Recognition

- CONTRIBUTORS file in each repository
- GitHub Sponsors for significant contributors
- Quarterly contributor spotlight
- Invitation to maintainer team for sustained contributions

## Community Governance

### Roles

| Role | Responsibilities | Requirements |
|---|---|---|
| User | Uses the software | None |
| Contributor | Submits PRs, issues, docs | Signed CLA |
| Maintainer | Reviews PRs, triages issues | Sustained contribution, nominated |
| Core Maintainer | Architecture decisions, releases | Employee or elected |
| Steering Committee | Roadmap, license, strategy | Core maintainers + community rep |

### Decision-Making

- **Technical decisions** -- Lazy consensus among relevant maintainers
- **Architecture decisions** -- ADR process with review period
- **Roadmap decisions** -- Public RFC process with community comment period
- **License/strategy decisions** -- Steering committee

## Ecosystem Strategy

### Integrations

Priority integrations for Year 1:

| Category | Target | Status |
|---|---|---|
| Robotics | ROS 2 | Planned |
| Robotics | Balena | Planned |
| Cloud | AWS IoT Core | Planned |
| Cloud | Google Cloud IoT | Research |
| CI/CD | GitHub Actions | Planned |
| CI/CD | GitLab CI | Research |
| Monitoring | Prometheus / Grafana | Planned |
| Logging | Loki / ELK | Planned |
| Orchestration | Kubernetes | Planned |
| Orchestration | Docker Compose | Planned |
| IaC | Terraform | Planned |

### Partnership Tiers

| Tier | Benefits | Requirements |
|---|---|---|
| Technology Partner | Integration documentation, joint blog post | Working integration |
| Solution Partner | All above + co-marketing, joint case study | Production deployment |
| Reseller Partner | All above + revenue share | Sales team, certified engineers |

## Competitive Positioning

### Differentiators

1. **Hardware-backed identity** -- TPM 2.0 and secure enclave integration, not just software keys
2. **Hash-chain audit** -- Tamper-evident logs, not mutable database records
3. **Optional blockchain anchoring** -- Solana for cross-organizational trust, not required for single-org use
4. **Real-time trust scoring** -- Continuous evaluation, not periodic scans
5. **Open core** -- Auditable core infrastructure, not proprietary black boxes

### Positioning Statement

> Sentinel Labs is the trust infrastructure for autonomous systems. We provide the identity, attestation, and audit layer that makes machine-to-machine communication verifiable, tamper-evident, and auditable.

## Marketing Channels

| Channel | Strategy |
|---|---|
| GitHub | Primary -- open source discovery |
| Discord | Community engagement, support |
| Twitter/X | Announcements, thought leadership |
| Blog | Technical deep dives, case studies |
| Conferences | Talks at RustConf, ROS World, KubeCon |
| Podcasts | Engineering-focused podcasts |
| Hacker News | Launch announcements |
| /r/robotics | Community engagement |
| Stack Overflow | Support and Q&A |
