export const posts = [
  {
    slug: "introducing-sentinels",
    title: "Introducing Sentinels: Trust Infrastructure for Autonomous Machines",
    excerpt: "Today we're launching Sentinels â€” the identity, verification, and compliance layer that every robotics fleet needs. Here's why we built it and what's next.",
    author: "Sentinels Team",
    date: "2026-01-15",
    readTime: "5 min",
    category: "Announcement",
    content: `## The Problem

Robots today are insecure and unverifiable. Enterprises deploying autonomous systems cannot reliably prove which robot performed an action, whether firmware was compromised, whether telemetry is authentic, or whether logs are trustworthy.

This becomes critical in warehouses, drone delivery, autonomous vehicles, industrial systems, and robotics fleets operating at scale.

## What We Built

Sentinels is the trust infrastructure layer for autonomous machines. Every robot gets:

- **Cryptographic identity** â€” Ed25519 keypair + W3C DID registration
- **Signed action logs** â€” every event cryptographically signed and timestamped
- **Firmware verification** â€” SHA-256 hash verification with on-chain proofs
- **Trust scoring** â€” dynamic 0-100 score based on behavior and attestation
- **Immutable audit trail** â€” hash-chained logs anchored on Solana

## Architecture

We use a hybrid on-chain/off-chain architecture:

- **On-chain (Solana):** Robot DIDs, firmware proofs, trust state, signatures
- **Off-chain (PostgreSQL):** Telemetry, logs, analytics, fleet data

This gives us the immutability of blockchain with the performance of traditional databases.

## What's Next

We're starting with robotics startups who need fleet management, auth, telemetry, and compliance. Phase 2 expands into warehouses and logistics. Phase 3 targets defense and industrial sectors.

Request access at sentinels.dev to get started.`,
  },
  {
    slug: "why-robots-need-identity",
    title: "Why Every Robot Needs a Cryptographic Identity",
    excerpt: "Robots today operate without verifiable identity. We explain why decentralized identifiers and hardware attestation are critical for enterprise robotics.",
    author: "Sentinels Team",
    date: "2026-01-10",
    readTime: "8 min",
    category: "Engineering",
    content: `## The Identity Gap

When a robot performs an action in your warehouse â€” picks an item, moves a pallet, reports its location â€” how do you know it's actually that robot? How do you know the message wasn't spoofed, replayed, or injected by a compromised system?

Traditional robotics systems use network-level authentication (IP addresses, MAC addresses) or shared secrets. These are trivially spoofable.

## Decentralized Identifiers (DIDs)

Sentinels assigns every robot a W3C-compliant Decentralized Identifier:

\`\`\`
did:sentinels:0x7f3a8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a
\`\`\`

This DID is:
- **Self-sovereign** â€” the robot owns its identity, not a central authority
- **Cryptographically verifiable** â€” backed by an Ed25519 keypair
- **On-chain registered** â€” anchored on Solana for immutable proof of existence

## Hardware Attestation

A DID alone isn't enough. If the private key is extracted from a compromised robot, an attacker could impersonate it. That's why we support hardware attestation:

- **TPM 2.0** â€” Trusted Platform Module stores keys in tamper-resistant hardware
- **Secure Enclave** â€” ARM TrustZone for mobile and embedded devices
- **Intel SGX** â€” Software Guard Extensions for x86 industrial systems

The hardware fingerprint is bound to the DID, making identity theft physically impossible without the original hardware.

## Key Rotation

Keys don't last forever. Sentinels supports automatic key rotation with zero-downtime transition:

1. New keypair generated
2. New DID derived
3. Rotation event signed with old key
4. Old key revoked after grace period
5. All systems updated atomically

This ensures that even if a key is eventually compromised, the window of vulnerability is minimal.`,
  },
  {
    slug: "firmware-verification-solana",
    title: "Firmware Verification with On-Chain Proofs",
    excerpt: "How we use Solana to create immutable firmware verification records that prove your robots are running untampered code.",
    author: "Sentinels Team",
    date: "2026-01-05",
    readTime: "6 min",
    category: "Technical",
    content: `## Why Firmware Integrity Matters

A compromised firmware update is the most dangerous attack vector in robotics. If an attacker can modify the code running on your robots, they control everything â€” movement, sensors, communications, and data.

## The Verification Pipeline

Sentinels's firmware verification works in 6 steps:

1. **Build** â€” Firmware compiled from source
2. **Hash** â€” SHA-256 and Blake3 hashes computed
3. **Sign** â€” Hash signed with project key
4. **Anchor** â€” Proof stored on Solana (immutable)
5. **Distribute** â€” Firmware deployed to fleet
6. **Verify** â€” Each robot verifies hash at boot

## On-Chain Proofs

We use Solana's Memo program to store firmware proofs:

\`\`\`
Transaction: 5Kj8...9xYz
Memo: SENTINELS:FIRMWARE:unit-0042:v2.4.1:SHA-256:a4e8f...91cd
Slot: 258491032
\`\`\`

This creates an immutable, timestamped record that:
- Cannot be modified after the fact
- Can be independently verified by anyone
- Proves the firmware existed at a specific point in time
- Costs fractions of a cent per proof

## Zero-Trust Boot

Every time a robot boots, it:

1. Computes its own firmware hash
2. Fetches the expected hash from Sentinels
3. Verifies the on-chain proof matches
4. Only proceeds if verification passes

If verification fails, the robot enters a quarantine state and alerts the fleet operator.`,
  },
  {
    slug: "trust-scoring-explained",
    title: "Trust Scoring: How Sentinels Measures Robot Reliability",
    excerpt: "A deep dive into our trust scoring algorithm â€” how we combine firmware integrity, telemetry patterns, uptime, and anomaly detection into a single score.",
    author: "Sentinels Team",
    date: "2024-12-20",
    readTime: "10 min",
    category: "Technical",
    content: `## What is a Trust Score?

Every robot in Sentinels has a trust score from 0 to 100. This score represents our confidence that the robot is operating correctly, with verified firmware, authentic telemetry, and no signs of compromise.

## Scoring Factors

The trust score is computed from five weighted factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Firmware Verified | 30% | Is the current firmware hash verified on-chain? |
| Telemetry Authentic | 25% | Are all telemetry signatures valid? |
| Uptime | 20% | How long has the robot been continuously operational? |
| Anomaly Count | 15% | How many anomalies detected in recent history? |
| Key Age | 10% | How recently was the key rotated? |

## Score Calculation

\`\`\`typescript
function computeTrustScore(factors) {
  let score = 0;
  score += factors.firmwareVerified ? 30 : 0;
  score += factors.telemetryAuthentic ? 25 : 0;
  score += Math.min(factors.uptimeHours / 720, 1) * 20;
  score += Math.max(0, 15 - factors.anomalyCount * 3);
  score += factors.keyAge < 30 ? 10 : factors.keyAge < 90 ? 5 : 0;
  return Math.round(Math.max(0, Math.min(100, score)));
}
\`\`\`

## Automatic Actions

Trust scores trigger automatic responses:

- **Score < 50** â€” Alert sent to fleet operator
- **Score < 30** â€” Robot commands restricted
- **Score < 20** â€” Robot marked as COMPROMISED, isolated from fleet

## Recovery

A compromised robot can recover its trust score by:
1. Firmware re-verification (fresh hash + on-chain proof)
2. Key rotation (new keypair generated)
3. Clean telemetry period (24h of verified data)`,
  },
  {
    slug: "zero-trust-robotics",
    title: "Zero-Trust Architecture for Robotics Fleets",
    excerpt: "Traditional perimeter security doesn't work for distributed robot fleets. Here's how zero-trust principles apply to autonomous systems.",
    author: "Sentinels Team",
    date: "2024-12-15",
    readTime: "7 min",
    category: "Security",
    content: `## Why Perimeter Security Fails

Traditional IT security assumes a trusted internal network. Once you're "inside," you're trusted. This model completely breaks down for robotics:

- Robots operate in physical spaces, not behind firewalls
- They communicate over WiFi, cellular, and mesh networks
- They're physically accessible to anyone in the environment
- A single compromised robot can attack the entire fleet

## Zero-Trust Principles for Robots

Sentinels implements zero-trust at every layer:

### 1. Never Trust, Always Verify

Every request from a robot must include:
- Valid DID authentication
- Current trust token (not expired)
- Signed payload (Ed25519 signature)

### 2. Least Privilege

Robots only have permissions for their assigned tasks:
- A warehouse picker can't access shipping bay controls
- A patrol drone can't modify other drones' routes
- A forklift can't issue commands to other forklifts

### 3. Assume Breach

We design assuming any robot could be compromised at any time:
- All telemetry is independently verified
- Firmware integrity checked at every boot
- Anomaly detection runs continuously
- Trust scores degrade without positive signals

### 4. Micro-Segmentation

Fleet communication is segmented:
- Robot-to-robot communication requires mutual authentication
- Fleet commands are signed by the operator's key
- Cross-fleet access requires explicit authorization

## Implementation

This isn't theoretical â€” Sentinels enforces these principles through:
- Hardware-backed identity (TPM/Secure Enclave)
- Cryptographic signatures on every message
- On-chain proof anchoring for immutability
- Dynamic trust scoring with automatic isolation`,
  },
  {
    slug: "warehouse-automation-compliance",
    title: "Compliance Requirements for Warehouse Automation",
    excerpt: "A guide to SOC 2, ISO 27001, and IEC 62443 compliance for companies deploying autonomous robots in warehouse environments.",
    author: "Sentinels Team",
    date: "2024-12-10",
    readTime: "9 min",
    category: "Enterprise",
    content: `## The Compliance Landscape

Deploying autonomous robots in warehouses triggers multiple compliance frameworks. Your customers, insurers, and regulators will ask: "How do you know your robots are secure?"

## Key Frameworks

### SOC 2 Type II

SOC 2 requires demonstrating security controls over time. For robotics, this means:

- **Access Control** â€” Who can command robots? How is access managed?
- **Change Management** â€” How are firmware updates deployed and verified?
- **Monitoring** â€” How do you detect compromised robots?
- **Incident Response** â€” What happens when a robot is breached?

Sentinels provides: immutable audit logs, firmware verification records, trust score history, and command authorization trails.

### ISO 27001

ISO 27001 requires an Information Security Management System (ISMS). For robotics:

- **Asset Management** â€” Every robot registered with cryptographic identity
- **Cryptography** â€” Ed25519 signatures, SHA-256 hashing, TLS 1.3
- **Operations Security** â€” Continuous monitoring, anomaly detection
- **Supplier Relationships** â€” Verified firmware from trusted sources

### IEC 62443

Specific to industrial automation and control systems:

- **Security Levels** â€” SL1 through SL4 based on threat environment
- **Zone Segmentation** â€” Fleet micro-segmentation with mutual auth
- **Component Security** â€” Hardware attestation, secure boot
- **System Integrity** â€” Runtime verification, tamper detection

## How Sentinels Helps

Sentinels's Enterprise plan includes:

- **Automated compliance reports** â€” SOC 2, ISO 27001, IEC 62443
- **Audit log exports** â€” Cryptographically signed, timestamped
- **Evidence collection** â€” Firmware proofs, trust score history
- **Gap analysis** â€” Identify missing controls before audits

Contact our enterprise team to discuss your specific compliance requirements.`,
  },
];
