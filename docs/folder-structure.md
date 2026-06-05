# Documentation Folder Structure

This is the planned structure for the sentinel-docs repository (Fumadocs-based).

```
sentinel-docs/
  content/
    meta.json                  -- Navigation metadata
    index.mdx                  -- Landing page

    overview/
      index.mdx                -- Introduction
      quick-start.mdx          -- 5-minute quick start
      concepts.mdx             -- Core concepts
      architecture.mdx         -- System architecture (deep)
      security-model.mdx       -- Security model overview

    guides/
      index.mdx                -- Guides overview
      device-registration.mdx  -- Registering a device
      fleet-setup.mdx           -- Setting up a fleet
      telemetry-pipeline.mdx   -- Configuring telemetry
      trust-scoring.mdx        -- Understanding trust scores
      audit-export.mdx         -- Exporting audit trails
      key-rotation.mdx         -- Key rotation best practices
      anomaly-detection.mdx    -- Configuring anomaly detection
      webhooks.mdx             -- Setting up webhooks

    core/
      index.mdx                -- sentinel-core overview
      identity-registry.mdx    -- Identity management
      attestation.mdx          -- Attestation protocol
      trust-engine.mdx         -- Trust score computation
      audit-trail.mdx          -- Hash-chain audit log
      anomaly-engine.mdx       -- Anomaly detection rules
      api-reference.mdx        -- Core API reference

    agent/
      index.mdx                -- sentinel-agent overview
      installation.mdx         -- Installation guide
      configuration.mdx        -- Configuration reference
      commands.mdx             -- Agent commands
      telemetry.mdx            -- Telemetry collection
      firmware-updates.mdx     -- OTA firmware update
      troubleshooting.mdx      -- Common issues

    cloud/
      index.mdx                -- sentinel-cloud overview
      deployment.mdx           -- Deployment options
      configuration.mdx        -- Environment configuration
      api-reference.mdx        -- Full REST API reference
      authentication.mdx       -- Auth (API keys, JWT)
      webhooks.mdx             -- Webhook system
      rbac.mdx                 -- Role-based access control
      billing.mdx              -- Billing and plans
      export.mdx               -- Audit export formats

    chain/
      index.mdx                -- sentinel-chain overview
      programs.mdx             -- Anchor programs
      deployment.mdx           -- Deploying to Solana
      verification.mdx         -- On-chain verification
      sdk.mdx                  -- Chain SDK usage

    sdk/
      index.mdx                -- SDK overview
      typescript/
        index.mdx              -- TypeScript SDK
        quick-start.mdx        -- TypeScript quick start
        client.mdx             -- SentinelClient reference
        examples.mdx           -- TypeScript examples
      rust/
        index.mdx              -- Rust SDK
        quick-start.mdx        -- Rust quick start
        api.mdx                -- Rust API reference
      python/
        index.mdx              -- Python SDK
        quick-start.mdx        -- Python quick start
        api.mdx                -- Python API reference

    cli/
      index.mdx                -- CLI overview
      installation.mdx         -- Installing the CLI
      commands.mdx             -- Command reference
      configuration.mdx        -- CLI configuration
      examples.mdx             -- Usage examples

    dashboard/
      index.mdx                -- Dashboard overview
      getting-started.mdx      -- Dashboard setup
      fleet-view.mdx           -- Fleet monitoring
      realtime.mdx             -- Real-time view
      settings.mdx             -- Settings and configuration

    firmware/
      index.mdx                -- Firmware overview
      tpm-integration.mdx      -- TPM 2.0 integration
      secure-enclave.mdx       -- Secure enclave integration
      build.mdx                -- Building from source
      flashing.mdx             -- Flashing firmware

    operations/
      index.mdx                -- Operations overview
      deployment/
        docker.mdx             -- Docker deployment
        kubernetes.mdx         -- Kubernetes (Helm)
        bare-metal.mdx         -- Bare metal deployment
        air-gapped.mdx         -- Air-gapped deployment
      monitoring/
        metrics.mdx            -- Available metrics
        logging.mdx            -- Logging configuration
        alerting.mdx           -- Alerting rules
      scaling/
        horizontal.mdx         -- Horizontal scaling
        multi-region.mdx       -- Multi-region deployment
        disaster-recovery.mdx  -- DR procedures

    contributing/
      index.mdx                -- Contributing overview
      development.mdx          -- Development setup
      code-style.mdx           -- Code style guide
      testing.mdx              -- Testing guide
      documentation.mdx        -- Writing documentation
      review-process.mdx       -- PR review guide

    api/
      index.mdx                -- API reference index
      openapi.json             -- OpenAPI 3.1 spec
      rest.mdx                 -- REST API reference
      graphql.mdx              -- GraphQL API (if applicable)
      errors.mdx               -- Error codes

  public/
    images/                    -- Screenshots, diagrams
    fonts/                     -- Custom fonts
    _redirects                 -- URL redirects

  source/
    lib/                       -- Fumadocs configuration
    components/                -- Custom MDX components
      diagrams.tsx             -- Mermaid wrapper
      api-example.tsx          -- API example component
      code-group.tsx           -- Tabbed code groups
      steps.tsx                -- Step-by-step guide component

  fumadocs.config.ts           -- Fumadocs configuration
  next.config.ts               -- Next.js configuration
  package.json
  tsconfig.json
  tailwind.config.ts
```
