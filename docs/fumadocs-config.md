# Fumadocs Configuration Plan

This document describes how to set up the Fumadocs-based documentation portal in the sentinel-docs repository.

## Package Setup

```json
{
  "name": "sentinel-docs",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "serve": "next start",
    "lint": "next lint",
    "format": "prettier --write ."
  },
  "dependencies": {
    "next": "^14",
    "fumadocs": "^13",
    "fumadocs-core": "^7",
    "fumadocs-ui": "^7",
    "fumadocs-mdx": "^8",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.300"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

## Configuration: fumadocs.config.ts

```typescript
import { defineConfig } from "fumadocs/config";

export default defineConfig({
  name: "Sentinel Labs",
  description: "Trust infrastructure for autonomous systems",
  logo: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
  },
  theme: {
    primary: {
      hue: 142,
      saturation: 71,
    },
  },
  search: {
    type: "local",
  },
  banner: {
    text: "Sentinel Labs is in public alpha. APIs may change.",
    bg: "#27272a",
    textColor: "#fafafa",
  },
  i18n: {
    default: "en",
    locales: ["en"],
  },
});
```

## Theme Customization (tailwind.config.ts)

```typescript
import { createPreset } from "fumadocs-ui/tailwind-plugin";

export default {
  content: [
    "./content/**/*.mdx",
    "./node_modules/fumadocs-ui/dist/**/*.js",
  ],
  presets: [createPreset()],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0b",
        foreground: "#fafafa",
        muted: "#a1a1aa",
        border: "#27272a",
        card: "#18181b",
        accent: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
        info: "#3b82f6",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
```

## Layout (source/app/layout.tsx)

```typescript
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
```

## Navigation (source/app/layout.tsx sidebar)

```typescript
import { DocsLayout } from "fumadocs-ui/layout";
import { pageTree } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={pageTree}
      nav={{
        title: "Sentinel Labs",
        transparentMode: "top",
        githubUrl: "https://github.com/SentinelLabs",
      }}
      sidebar={{
        defaultOpen: true,
        prefetch: true,
      }}
    >
      {children}
    </DocsLayout>
  );
}
```

## Source Configuration (source/lib/source.ts)

```typescript
import { map } from ".map";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

export const { getPage, getPages, pageTree } = loader({
  baseUrl: "/",
  source: createMDXSource(map),
});
```

## Search

Fumadocs provides built-in local search. Configuration:

```typescript
search: {
  type: "local",
  options: {
    placeholder: "Search documentation...",
    shortcut: ["/"],
  },
}
```

For production, you can optionally switch to Algolia or Meilisearch:

```typescript
search: {
  type: "algolia",
  options: {
    appId: process.env.ALGOLIA_APP_ID!,
    apiKey: process.env.ALGOLIA_API_KEY!,
    indexName: "sentinel-docs",
  },
}
```

## Custom MDX Components

Create shared components in `source/components/`:

### api-example.tsx

```typescript
export function ApiExample({
  method = "GET",
  path,
  description,
  code,
}: {
  method?: string;
  path: string;
  description: string;
  code: string;
}) {
  return (
    <div className="rounded-lg border p-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">
          {method}
        </span>
        <code className="text-sm font-mono">{path}</code>
      </div>
      <p className="text-sm text-muted mb-2">{description}</p>
      <pre className="bg-card rounded p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
```

### code-group.tsx

```typescript
export function CodeGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border overflow-hidden my-4">
      {children}
    </div>
  );
}
```

## pageTree Metadata (content/meta.json)

```json
{
  "pages": [
    "overview",
    "---Guides---",
    ["guides/index", "Getting Started"],
    "guides/device-registration",
    "guides/fleet-setup",
    "---Core---",
    ["core/index", "sentinel-core"],
    "core/identity-registry",
    "core/attestation",
    "---More---",
    "agent",
    "cloud",
    "chain",
    "sdk",
    "cli",
    "dashboard",
    "operations",
    "api",
    "contributing"
  ]
}
```

## Deployment

### Vercel

1. Connect sentinel-docs repository to Vercel
2. Set framework to Next.js
3. Set environment variables as needed
4. Deploy

### Self-Hosted

```bash
# Build
npm run build

# Serve with Node
npm run serve

# Or Docker
docker build -t sentinel-docs .
docker run -p 3000:3000 sentinel-docs
```

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "run", "serve"]
```
