# Sentinels Documentation

This directory contains the source for the Sentinels documentation portal, built with [Fumadocs](https://fumadocs.vercel.app).

## Structure

```
docs/
  overview/            -- Introduction and getting started
  guides/              -- How-to guides and tutorials
  core/                -- sentinel-core documentation
  agent/               -- sentinel-agent documentation
  cloud/               -- sentinel-cloud documentation
  chain/               -- sentinel-chain documentation
  sdk/                 -- sentinel-sdk documentation
  cli/                 -- sentinel-cli documentation
  dashboard/           -- sentinel-dashboard documentation
  firmware/            -- sentinel-firmware documentation
  api/                 -- API reference
  architecture/        -- Architecture deep dives
  operations/          -- Deployment and operations
  contributing/        -- Contribution guides
```

## Building

```bash
npm install
npm run dev     # development
npm run build   # production
npm run serve   # serve built output
```

## Writing Documentation

All documentation is written in MDX. See the Fumadocs documentation for syntax and component reference.

### Frontmatter

```yaml
---
title: Page Title
description: Brief description for SEO and navigation
icon: IconName
---

Content here.
```

### Standards

- Use active voice.
- Write for the target audience (developer, operator, contributor).
- Include code examples for all API endpoints.
- Use Mermaid diagrams for architecture and flow.
- Keep pages focused and link to deeper content.
