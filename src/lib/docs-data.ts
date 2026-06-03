export const docSections = [
  {
    slug: "quick-start",
    title: "Quick Start",
    category: "Getting Started",
    content: `## Overview

Sentinels provides cryptographic identity and trust verification for autonomous machines. This guide walks you through setup in under five minutes.

---

## Prerequisites

- A Sentinels account ([request access](https://sentinels.today))
- Terminal access (macOS, Linux, or WSL on Windows)
- Node.js 18+ (for SDK usage)

---

## Step 1 â€” Install the CLI

\`\`\`bash
curl -fsSL https://get.sentinels.today | sh
\`\`\`

Verify the installation:

\`\`\`bash
sentinels --version
\`\`\`

---

## Step 2 â€” Authenticate

\`\`\`bash
sentinels auth login
\`\`\`

This opens your browser for authentication. Once complete, your session token is stored locally at \`~/.sentinels/credentials\`.

---

## Step 3 â€” Initialize a project

\`\`\`bash
sentinels init --project my-fleet
\`\`\`

This generates a \`sentinels.yaml\` configuration file containing your project ID and API keys.

> **Important:** Add \`sentinels.yaml\` to your \`.gitignore\`. Never commit credentials.

---

## Step 4 â€” Register a device

\`\`\`bash
sentinels register \\
  --name unit-001 \\
  --model forklift-v2 \\
  --serial SN-2026-001
\`\`\`

**Output:**

\`\`\`
âœ“ Device registered
  ID:          clx8f2k...
  DID:         did:sentinels:0x7f3a...b2c1
  Trust Score: 100/100
  Status:      registered
\`\`\`

Behind the scenes, Sentinels generates an Ed25519 keypair, derives a decentralized identifier (DID), and initializes the trust score.

---

## Step 5 â€” Verify firmware (recommended)

\`\`\`bash
sentinels verify firmware \\
  --robot unit-001 \\
  --version 2.4.1 \\
  --file ./firmware.bin \\
  --anchor
\`\`\`

The \`--anchor\` flag stores an immutable proof on Solana. Without it, verification is stored off-chain only.

---

## Next steps

- [Authentication](/docs/authentication) â€” Configure API keys and access control
- [Telemetry Signing](/docs/telemetry-signing) â€” Submit signed data from your devices
- [Fleet Commands](/docs/fleet-commands) â€” Send and track commands across your fleet`,
  },
  {
    slug: "authentication",
    title: "Authentication",
    category: "Getting Started",
    content: `## Overview

Every API request requires authentication. Sentinels supports three methods:

| Method | Best for |
|--------|----------|
| API Keys | Server-side integrations, CI/CD, backend services |
| Wallet Auth | Web3 applications, Solana-native teams |
| JWT Tokens | Session-based access after initial auth |

---

## API Keys

Generated when you create a project. Include it in the \`Authorization\` header:

\`\`\`bash
curl -H "Authorization: Bearer sk_live_abc123..." \\
  https://api.sentinels.today/v1/robots
\`\`\`

**SDK usage:**

\`\`\`typescript
import { Sentinels } from '@sentinels/sdk';

const sentinels = new Sentinels({
  apiKey: process.env.SENTINELS_API_KEY,
});
\`\`\`

---

## Wallet Authentication

For teams using Solana wallets (Phantom, Backpack, Solflare):

\`\`\`typescript
const sentinels = new Sentinels({
  wallet: phantomWallet,
});

await sentinels.auth.connectWallet();
\`\`\`

The SDK requests a signature of a one-time challenge. No passwords or email required.

---

## JWT Tokens

After successful authentication, you receive a token:

\`\`\`json
{
  "token": "eyJhbGciOiJFZDI1NTE5...",
  "expiresAt": "2026-01-16T10:00:00Z",
  "fleetId": "fleet-abc123"
}
\`\`\`

Tokens are valid for **24 hours**. Include them in subsequent requests:

\`\`\`bash
curl -H "Authorization: Bearer eyJhbGci..." \\
  https://api.sentinels.today/v1/fleet/stats
\`\`\`

---

## Scopes

Each API key is assigned scopes that define its permissions:

| Scope | Permissions |
|-------|-------------|
| \`fleet:read\` | View fleet data, device status, trust scores |
| \`fleet:write\` | Register devices, send commands, update status |
| \`firmware:verify\` | Submit firmware for hash verification |
| \`audit:read\` | Query audit logs and compliance exports |
| \`admin\` | Full access to all endpoints |

**Best practice:** Create separate keys per environment. Use \`fleet:read\` for dashboards, \`fleet:write\` for device runtimes, and \`admin\` only for infrastructure automation.

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Device registration | 10 requests/minute |
| Telemetry submission | 120 requests/minute |
| Command dispatch | 30 requests/minute |
| All other endpoints | 60 requests/minute |

Exceeding limits returns \`429 Too Many Requests\` with a \`Retry-After\` header.`,
  },
  {
    slug: "robot-registration",
    title: "Device Registration",
    category: "Identity",
    content: `## Overview

Registration creates a cryptographic identity for a device. Each registered device receives:

- An **Ed25519 keypair** for signing operations
- A **Decentralized Identifier (DID)** derived from the public key
- A **hardware fingerprint** for physical device binding
- An initial **trust score** of 100

---

## Register a device

\`\`\`typescript
const device = await sentinels.devices.register({
  name: 'unit-0042',
  model: 'forklift-v2',
  serialNumber: 'SN-2026-0042',
});
\`\`\`

**Response:**

\`\`\`json
{
  "id": "clx1a2b3c...",
  "name": "unit-0042",
  "did": "did:sentinels:0x7f3a8b2c1d4e5f6a...",
  "publicKey": "-----BEGIN PUBLIC KEY-----...",
  "publicKeyHex": "0x4a8f3c2d...",
  "hardwareFingerprint": "0x8a3f7b2c...",
  "trustScore": 100,
  "status": "registered"
}
\`\`\`

---

## Serial number uniqueness

Serial numbers are unique across your fleet. Attempting to register a duplicate returns \`409 Conflict\`.

---

## Batch registration

For onboarding multiple devices:

\`\`\`typescript
const devices = await sentinels.devices.registerBatch([
  { name: 'unit-001', model: 'agv-v3', serialNumber: 'SN-001' },
  { name: 'unit-002', model: 'agv-v3', serialNumber: 'SN-002' },
  { name: 'unit-003', model: 'agv-v3', serialNumber: 'SN-003' },
]);
\`\`\`

Each device receives an independent keypair. No shared secrets between devices.

---

## Key management

Private keys are stored encrypted at rest. For production deployments, we recommend hardware-backed key storage:

| Platform | Method |
|----------|--------|
| Industrial x86 | TPM 2.0 |
| ARM devices | Secure Enclave / TrustZone |
| Intel systems | SGX (optional) |

With hardware attestation enabled, the private key never leaves the device's secure element.

---

## Device lifecycle

\`\`\`
registered â†’ active â†’ offline â†’ decommissioned
                    â†’ compromised
\`\`\`

Status transitions are logged in the audit chain automatically.`,
  },
  {
    slug: "firmware-verification",
    title: "Firmware Verification",
    category: "Trust Verification",
    content: `## Overview

Firmware verification ensures devices run untampered code. Sentinels hashes the firmware binary, validates the signature chain, and optionally anchors the proof on Solana.

---

## Verify firmware

\`\`\`typescript
const proof = await sentinels.verify.firmware({
  robotId: 'clx1a2b3c...',
  version: '2.4.1',
  firmwareData: Buffer.from(firmwareBinary),
});
\`\`\`

**Response:**

\`\`\`json
{
  "verified": true,
  "hash": "SHA-256:a4e8f3b2c1d4e5f6a7b8c9d0...",
  "signature": "0x7f3a8b2c...",
  "previousHash": "SHA-256:b5f9g4c3d2e5f6g7...",
  "trustScoreUpdate": {
    "before": 70,
    "after": 100
  }
}
\`\`\`

Firmware verification is the highest-weighted factor in trust scoring (+30 points).

---

## Verification process

1. Binary hashed with SHA-256
2. Hash signed with the device's private key
3. Signature validated against the registered public key
4. Hash chain integrity checked (links to previous firmware record)
5. Trust score recalculated

---

## On-chain anchoring

Create an immutable, publicly verifiable record on Solana:

\`\`\`typescript
const anchor = await sentinels.solana.anchor({
  hash: proof.hash,
  robotDid: device.did,
  proofType: 'firmware',
});
\`\`\`

**Response:**

\`\`\`json
{
  "txSignature": "5Kj8mN2x...",
  "slot": 258491032,
  "explorerUrl": "https://explorer.solana.com/tx/5Kj8mN2x..."
}
\`\`\`

Cost: < $0.001 per proof. Provides a timestamp and hash that cannot be disputed or modified.

---

## When to verify

| Scenario | Recommendation |
|----------|---------------|
| After firmware update | Required |
| On device boot | Recommended (zero-trust boot) |
| Periodic runtime check | Optional (high-security environments) |

---

## Failure handling

If verification fails:

- Trust score drops immediately
- Fleet operator receives an alert
- Device can be automatically quarantined (configurable)`,
  },
  {
    slug: "telemetry-signing",
    title: "Telemetry Signing",
    category: "Trust Verification",
    content: `## Overview

Telemetry signing provides cryptographic proof that data originated from a specific device and was not modified in transit. Every data point can be independently verified.

---

## Submit signed telemetry

When the device signs data locally:

\`\`\`typescript
const result = await sentinels.telemetry.submit({
  robotId: 'clx1a2b3c...',
  eventType: 'sensor',
  payload: {
    position: { x: 24.551, y: -12.003 },
    battery: 87.2,
    velocity: 1.204,
  },
  signature: deviceSignature,
});
\`\`\`

---

## Server-side signing

For devices that cannot sign locally, Sentinels signs on their behalf:

\`\`\`typescript
const result = await sentinels.telemetry.submit({
  robotId: 'clx1a2b3c...',
  eventType: 'heartbeat',
  payload: { status: 'active', uptime: 3600 },
});
\`\`\`

> **Note:** Server-signed telemetry incurs a -5 trust score penalty. Device-signed data has no penalty.

---

## Event types

| Type | Use case |
|------|----------|
| \`heartbeat\` | Periodic availability signal |
| \`sensor\` | Environmental or operational readings |
| \`location\` | GPS or indoor positioning data |
| \`battery\` | Power level and charging state |
| \`error\` | Fault or anomaly report |

---

## Trust score impact

| Scenario | Effect |
|----------|--------|
| Valid device signature | No change |
| Server-signed (no device signature) | -5 points |
| Signature verification failure | -10 points + alert |
| Trust score below 20 | Device marked \`COMPROMISED\` |

---

## Real-time streaming

Telemetry events are broadcast via WebSocket for live dashboard updates:

\`\`\`typescript
import { useRealtimeTelemetry } from '@/hooks/use-realtime';

const { events, connected } = useRealtimeTelemetry(robotId);
\`\`\`

Events arrive within milliseconds of submission.`,
  },
  {
    slug: "fleet-commands",
    title: "Fleet Commands",
    category: "Fleet Management",
    content: `## Overview

Commands allow you to control devices remotely. Every command is authenticated, logged in the audit trail, and tracked through its lifecycle.

---

## Send a command

\`\`\`typescript
const command = await sentinels.commands.send({
  robotId: 'clx1a2b3c...',
  type: 'REBOOT',
  payload: { reason: 'scheduled-maintenance' },
});
\`\`\`

---

## Command types

| Type | Description |
|------|-------------|
| \`STATUS_CHECK\` | Request current device state |
| \`REBOOT\` | Restart the device |
| \`UPDATE_FIRMWARE\` | Initiate firmware update |
| \`EMERGENCY_STOP\` | Immediate halt â€” highest priority |
| \`CUSTOM\` | Application-specific command with payload |

---

## Lifecycle

Commands progress through defined states:

\`\`\`
PENDING â†’ SENT â†’ ACKNOWLEDGED â†’ COMPLETED
                              â†’ FAILED
\`\`\`

Monitor status via polling or WebSocket subscription.

---

## Batch commands

Send the same command to multiple devices:

\`\`\`typescript
await sentinels.commands.sendBatch({
  robotIds: ['device-1', 'device-2', 'device-3'],
  type: 'UPDATE_FIRMWARE',
  payload: { version: '2.5.0' },
});
\`\`\`

---

## Command history

\`\`\`typescript
const history = await sentinels.commands.list({
  robotId: 'clx1a2b3c...',
  limit: 20,
  status: 'completed',
});
\`\`\`

---

## Permissions

Command dispatch requires the \`fleet:write\` scope. Read-only API keys cannot send commands.

All commands are recorded in the immutable audit log with:

- Issuer identity
- Timestamp
- Command type and payload
- Execution result

This provides full traceability for compliance and incident investigation.`,
  },
];
