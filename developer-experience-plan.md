# Developer Experience Plan

## Principles

1. **5-minute setup** -- A new developer should go from zero to running the agent in 5 minutes.
2. **Clear error messages** -- Every error message should explain what went wrong and how to fix it.
3. **Progressive disclosure** -- Defaults should work out of the box. Advanced options should be discoverable.
4. **Consistent APIs** -- All SDKs should follow the same patterns and naming conventions.
5. **Self-documenting** -- Good code, types, and comments reduce the need for external documentation.

## Quick Start Flow

```
1. Install CLI
   curl -fsSL https://get.sentinels.today | sh

2. Create API key
   sentinel auth login

3. Register a robot
   sentinel robots register --name "my-robot"

4. Install agent on device
   sentinel agents install --id <robot-id>

5. Verify connection
   sentinel status
```

This flow should work in under 5 minutes with no configuration files.

## SDK Design Principles

### TypeScript

```typescript
import { SentinelClient } from "@sentinels-today/sdk";

const client = new SentinelClient({
  apiKey: process.env.SENTINEL_API_KEY,
});

// Typed responses
const robot = await client.robots.get("robot-id");
console.log(robot.trustScore); // number -- autocompleted

// Method chaining where appropriate
const events = await client.telemetry
  .query({ robotId: "robot-id" })
  .limit(50)
  .since("24h")
  .execute();
```

### Rust

```rust
use sentinel_sdk::SentinelClient;

let client = SentinelClient::new("api-key")?;

// Strongly typed with serde
let robot: Robot = client.robots().get("robot-id").await?;
println!("Trust score: {}", robot.trust_score);
```

### Python

```python
from sentinel_sdk import SentinelClient

client = SentinelClient(api_key="...")
robot = client.robots.get("robot-id")
print(f"Trust score: {robot.trust_score}")
```

## CLI Design

```bash
# Global flags
sentinel --api-key <key> --endpoint <url> <command>

# Commands
sentinel auth login
sentinel auth logout
sentinel auth status

sentinel robots list
sentinel robots get <id>
sentinel robots register [--name <name>] [--model <model>]
sentinel robots update <id> [--name <name>] [--status <status>]
sentinel robots delete <id>

sentinel telemetry query <robot-id> [--limit 50] [--since 24h]
sentinel telemetry stream <robot-id>

sentinel audit log <robot-id> [--format json|csv]
sentinel audit export <robot-id> --format pdf

sentinel keys list
sentinel keys generate [--fleet <fleet-id>]
sentinel keys revoke <key-id>

sentinel config init
sentinel config show
sentinel config set <key> <value>

sentinel version
sentinel help
sentinel completion <shell>
```

## Error Message Standards

All error messages follow this format:

```
Error: <what went wrong>
       <why it happened>
       <how to fix it>

  Code: E123
  Docs: https://sentinels.today/docs/errors/E123
```

Example:

```
Error: Failed to connect to sentinel-cloud
       The API endpoint "https://api.sentinels.today/v2" is unreachable.
       Check that the endpoint is correct and your network allows outbound
       connections on port 443.

  Code: E1001
  Docs: https://sentinels.today/docs/errors/E1001
```

## Documentation Experience

### Layered Documentation

1. **Quick Start** -- 5-minute setup, no configuration
2. **Guides** -- Task-oriented, step-by-step
3. **Reference** -- API docs, auto-generated
4. **Deep Dives** -- Architecture, security model, internals

### Interactive Elements

- Copy button on all code blocks
- Run-in-browser for SDK examples
- Search across all docs
- Keyboard shortcuts for power users
- Dark mode

## Onboarding Flow

### GitHub README

Every repository README follows this structure:

1. **Badges** -- Build status, version, license
2. **What is this?** -- One-paragraph description
3. **Quick Start** -- Copy-paste commands
4. **Documentation** -- Link to docs site
5. **Contributing** -- Link to CONTRIBUTING.md
6. **License** -- License information

### sentinels.today/docs

1. **Home** -- Hero with value prop, quick start CTA, ecosystem overview
2. **Quick Start** -- Interactive CLI commands
3. **Guides** -- Sidebar navigation by category
4. **API Reference** -- Auto-generated from OpenAPI spec
5. **SDK Reference** -- Per-language, auto-generated
6. **Architecture** -- Deep dives with diagrams
7. **Operations** -- Deployment, monitoring, scaling

## Feedback Loops

- Inline feedback widget on docs pages
- GitHub Discussions for Q&A
- Discord for real-time help
- Monthly community calls
- Quarterly contributor survey
- Annual NPS survey for developer experience
