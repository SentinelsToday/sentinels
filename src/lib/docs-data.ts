export const docSections = [
  {
    slug: "quick-start",
    title: "Quick Start Guide",
    category: "Getting Started",
    content: `## Get up and running in 5 minutes

Let's get your first robot registered and verified. No fluff — just the steps.

### 1. Install the CLI

\`\`\`bash
curl -fsSL https://get.sentinel.dev | sh
\`\`\`

On Windows? Use the installer from our releases page, or run it through WSL.

### 2. Log in

\`\`\`bash
sentinel auth login
\`\`\`

This opens your browser. Sign in, and the CLI stores your token locally.

### 3. Create a project

\`\`\`bash
sentinel init --project my-fleet
\`\`\`

You'll get a \`sentinel.yaml\` in your current directory. This holds your project config and API keys. Don't commit it to git.

### 4. Register a robot

\`\`\`bash
sentinel register --name unit-001 --model forklift --serial SN-2025-001
\`\`\`

That's it. Sentinel generates a keypair, creates a DID, and gives your robot a trust score of 100. You'll see something like:

\`\`\`
✓ Robot registered
  DID: did:sentinel:0x7f3a...b2c1
  Trust Score: 100/100
\`\`\`

### 5. Verify firmware (optional but recommended)

\`\`\`bash
sentinel verify firmware --robot unit-001 --version 2.4.1 --file ./firmware.bin
\`\`\`

This hashes your firmware, signs it, and stores the proof. If you want it anchored on Solana, add \`--anchor\`.

### What's next?

- Hook up telemetry from your robot's runtime
- Set up the fleet dashboard to monitor everything
- Read about trust scoring to understand how scores change over time`,
  },
  {
    slug: "authentication",
    title: "Authentication",
    category: "Getting Started",
    content: `## How auth works

Every request to Sentinel needs to prove who's making it. We support three methods depending on your use case.

### API Keys (most common)

You get an API key when you create a project. Pass it in the header:

\`\`\`bash
curl -H "Authorization: Bearer sk_live_abc123..." \\
  https://api.sentinel.dev/v1/robots
\`\`\`

In your SDK:

\`\`\`typescript
const sentinel = new Sentinel({
  apiKey: process.env.SENTINEL_API_KEY,
});
\`\`\`

Simple. Works for server-to-server calls, CI/CD, and backend services.

### Wallet auth (for Web3 flows)

If your team uses Solana wallets, you can sign in with Phantom, Backpack, or any wallet:

\`\`\`typescript
const sentinel = new Sentinel({
  wallet: phantomWallet,
});

await sentinel.auth.connectWallet();
\`\`\`

We verify the signature against your wallet's public key. No passwords, no emails.

### JWT tokens

After authenticating (either method), you get a JWT valid for 24 hours:

\`\`\`json
{
  "token": "eyJhbG...",
  "expiresAt": "2025-01-16T10:00:00Z",
  "fleetId": "fleet-abc123"
}
\`\`\`

Use this for subsequent requests. When it expires, re-authenticate.

### Scopes

API keys have scopes that control what they can do:

| Scope | What it allows |
|-------|---------------|
| \`fleet:read\` | View fleet and robot data |
| \`fleet:write\` | Register robots, send commands |
| \`firmware:verify\` | Submit firmware for verification |
| \`audit:read\` | Pull audit logs |
| \`admin\` | Everything |

You can create multiple keys with different scopes — one for your CI pipeline, one for your dashboard, one for your robot runtime.`,
  },
  {
    slug: "robot-registration",
    title: "Robot Registration",
    category: "Robot Identity",
    content: `## Registering robots

When you register a robot, Sentinel does a few things behind the scenes:

1. Generates an Ed25519 keypair (unique to this robot)
2. Derives a DID from the public key
3. Creates a hardware fingerprint
4. Logs the registration in the audit chain
5. Sets the initial trust score to 100

Here's how it looks in code:

\`\`\`typescript
const robot = await sentinel.robots.register({
  name: 'unit-0042',
  model: 'forklift-v2',
  serialNumber: 'SN-2025-0042',
});
\`\`\`

You get back:

\`\`\`json
{
  "id": "clx1234...",
  "name": "unit-0042",
  "did": "did:sentinel:0x7f3a8b2c...",
  "publicKey": "-----BEGIN PUBLIC KEY-----...",
  "hardwareFingerprint": "0x8a3f...c2d1",
  "trustScore": 100,
  "status": "registered"
}
\`\`\`

### A note on serial numbers

Serial numbers must be unique across your fleet. If you try to register a robot with a serial that already exists, you'll get a 409 conflict. This prevents accidental duplicates.

### Registering multiple robots at once

If you're onboarding a batch:

\`\`\`typescript
const robots = await sentinel.robots.registerBatch([
  { name: 'unit-001', model: 'agv', serialNumber: 'SN-001' },
  { name: 'unit-002', model: 'agv', serialNumber: 'SN-002' },
  { name: 'unit-003', model: 'agv', serialNumber: 'SN-003' },
]);
\`\`\`

Each one gets its own keypair and DID. No shared secrets.

### What happens to the private key?

The private key is stored encrypted on our servers. In production, we recommend using hardware attestation (TPM or Secure Enclave) so the key never leaves the robot's hardware. See the security docs for details.`,
  },
  {
    slug: "firmware-verification",
    title: "Firmware Verification",
    category: "Trust Verification",
    content: `## Why verify firmware?

If someone tampers with your robot's firmware, they control everything — movement, sensors, data. Firmware verification catches this before it becomes a problem.

### How it works

You submit your firmware binary. Sentinel:

1. Hashes it (SHA-256)
2. Signs the hash with the robot's key
3. Checks it against the previous firmware hash (chain integrity)
4. Updates the trust score
5. Optionally anchors the proof on Solana

\`\`\`typescript
const proof = await sentinel.verify.firmware({
  robotId: 'clx1234...',
  version: '2.4.1',
  firmwareData: Buffer.from(firmwareBinary),
});
\`\`\`

You get back:

\`\`\`json
{
  "verified": true,
  "hash": "SHA-256:a4e8f3b2c1d4e5f6...",
  "signature": "0x7f3a...",
  "previousHash": "SHA-256:b5f9g4c3d2e5f6g7...",
  "trustScoreUpdate": { "before": 70, "after": 100 }
}
\`\`\`

Notice the trust score jumped from 70 to 100. Verified firmware is the single biggest factor in trust scoring.

### Anchoring on Solana

If you want an immutable, publicly verifiable record:

\`\`\`typescript
const anchor = await sentinel.solana.anchor({
  hash: proof.hash,
  robotDid: robot.did,
  proofType: 'firmware',
});

console.log(anchor.explorerUrl);
// https://explorer.solana.com/tx/5Kj8...
\`\`\`

This costs fractions of a cent and gives you a timestamp that nobody can dispute.

### When to verify

- After every firmware update (obviously)
- On every boot (zero-trust boot)
- Periodically during runtime (paranoid mode)

If verification ever fails, the robot's trust score drops immediately and your fleet gets an alert.`,
  },
  {
    slug: "telemetry-signing",
    title: "Telemetry Signing",
    category: "Trust Verification",
    content: `## Signing telemetry data

Every piece of data your robot sends — position, battery level, sensor readings — can be cryptographically signed. This means you can prove the data came from that specific robot and wasn't modified in transit.

### Submitting signed telemetry

If your robot can sign data locally (it has access to its private key):

\`\`\`typescript
const result = await sentinel.telemetry.submit({
  robotId: 'clx1234...',
  eventType: 'sensor',
  payload: { position: { x: 24.5, y: -12.0 }, battery: 87.2 },
  signature: robotSignature, // signed on the robot itself
});
\`\`\`

### Server-side signing

If your robot can't sign locally (maybe it's a simple device), Sentinel signs it for you:

\`\`\`typescript
const result = await sentinel.telemetry.submit({
  robotId: 'clx1234...',
  eventType: 'heartbeat',
  payload: { status: 'active', uptime: 3600 },
  // no signature — we'll handle it
});
\`\`\`

This still works, but the trust score takes a small hit (-5 points) because we can't prove the robot itself produced the data.

### Event types

Use whatever makes sense for your system:

| Type | When to use it |
|------|---------------|
| \`heartbeat\` | Periodic "I'm alive" signal |
| \`sensor\` | Any sensor reading |
| \`location\` | GPS or indoor positioning |
| \`battery\` | Battery and charging state |
| \`error\` | Something went wrong |

### How this affects trust

- Valid signature from the robot → trust stays the same
- Server-signed (no robot signature) → -5 points
- Signature verification fails → -10 points + alert to your team

If trust drops below 20, the robot gets automatically marked as compromised. Better to catch a false positive than miss a real breach.`,
  },
  {
    slug: "fleet-commands",
    title: "Fleet Commands",
    category: "Fleet Management",
    content: `## Sending commands to robots

You can send commands to any robot in your fleet. Every command is logged in the audit trail, so you always know who told which robot to do what.

### Send a command

\`\`\`typescript
const command = await sentinel.commands.send({
  robotId: 'clx1234...',
  type: 'REBOOT',
  payload: { reason: 'firmware-update' },
});
\`\`\`

### Command types

| Type | What it does |
|------|-------------|
| \`STATUS_CHECK\` | Ask the robot for its current state |
| \`REBOOT\` | Restart it |
| \`UPDATE_FIRMWARE\` | Trigger a firmware update |
| \`EMERGENCY_STOP\` | Stop everything immediately |
| \`CUSTOM\` | Whatever you need — pass a payload |

### Command lifecycle

Commands go through stages:

\`\`\`
PENDING → SENT → ACKNOWLEDGED → COMPLETED
                              → FAILED
\`\`\`

You can poll for status or use webhooks to get notified when a command completes.

### Sending to multiple robots

Need to update your whole fleet?

\`\`\`typescript
await sentinel.commands.sendBatch({
  robotIds: ['robot-1', 'robot-2', 'robot-3'],
  type: 'UPDATE_FIRMWARE',
  payload: { version: '2.5.0' },
});
\`\`\`

### Viewing command history

\`\`\`typescript
const history = await sentinel.commands.list({
  robotId: 'clx1234...',
  limit: 20,
});
\`\`\`

Every command shows up in the audit log too, so compliance teams can see the full history of what was sent and when.

### A word on permissions

Commands are serious business. In production, make sure your API key has the \`fleet:write\` scope. Read-only keys can't send commands — that's by design.`,
  },
];
