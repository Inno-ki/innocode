<p align="center">
  <h1 align="center">InnoCode</h1>
</p>
<p align="center">AI-powered coding agent by InnoGPT</p>
<p align="center">
  <a href="https://www.npmjs.com/package/innocode"><img alt="npm" src="https://img.shields.io/npm/v/innocode?style=flat-square" /></a>
</p>

---

> **Attribution:** InnoCode is based on [OpenCode](https://github.com/anomalyco/opencode) by Anomaly Co., licensed under the MIT License. This project is not affiliated with the OpenCode team.

---

## About

InnoCode is InnoGPT's fork of OpenCode, pre-configured to work with the InnoGPT API. It provides a powerful AI coding agent in your terminal with support for multiple AI models.

## Installation

```bash
# npm/pnpm/yarn/bun
npm i -g innocode@latest
pnpm i -g innocode@latest
yarn global add innocode@latest
bun i -g innocode@latest
```

## Quick Start

### Using InnoGPT (Recommended)

1. **Get your API key** from [app.innogpt.de](https://app.innogpt.de)

2. **Set your InnoGPT API key:**
   ```bash
   export INNOGPT_API_KEY=your-api-key
   ```

3. **Run InnoCode:**
   ```bash
   innocode
   ```

### Using Other Providers

InnoCode supports all providers from OpenCode (OpenAI, Anthropic, Google, etc.). Set the appropriate API key:

```bash
export OPENAI_API_KEY=your-key
export ANTHROPIC_API_KEY=your-key
# etc.
```

## Configuration

Create an `innocode.json` file in your project root or `~/.config/innocode/`:

```json
{
  "$schema": "https://innocode.io/config.json",
  "provider": {
    "innogpt": {
      "options": {
        "apiKey": "your-api-key"
      }
    }
  },
  "model": "innogpt/gpt-4o"
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `INNOGPT_API_KEY` | Your InnoGPT API key |
| `INNOCODE_CONFIG` | Custom config file path |
| `INNOCODE_DISABLE_AUTOUPDATE` | Disable automatic updates |
| `INNOCODE_EXPERIMENTAL` | Enable experimental features |

> **Note:** For backwards compatibility, `OPENCODE_*` environment variables are also supported.

## Features

- **AI-Powered Development** - Chat with AI models to write, edit, and debug code
- **Multi-Model Support** - Use models from InnoGPT, OpenAI, Anthropic, Google, and more
- **Terminal UI** - Beautiful TUI built for developers
- **LSP Support** - Out of the box language server protocol support
- **Plugin System** - Extend functionality with plugins

## Agents

InnoCode includes two built-in agents you can switch between with the `Tab` key:

- **build** - Default, full access agent for development work
- **plan** - Read-only agent for analysis and code exploration

---

# Development & Maintenance

## Changes from OpenCode

This fork includes the following modifications from the original OpenCode:

### Branding Changes

| Component | OpenCode | InnoCode |
|-----------|----------|----------|
| Package name | `opencode` / `opencode-ai` | `innocode` |
| NPM scope | `@opencode-ai/*` | `@innogpt/innocode-*` |
| Binary name | `opencode` | `innocode` |
| Config file | `opencode.json` | `innocode.json` |
| Data directory | `~/.opencode/` | `~/.innocode/` |
| Env prefix | `OPENCODE_*` | `INNOCODE_*` (both supported) |

### Files Modified for Branding

```
packages/opencode/
├── bin/innocode                    # Renamed from bin/opencode
├── src/
│   ├── global/index.ts            # App name: "innocode"
│   ├── flag/flag.ts               # INNOCODE_* env vars (with OPENCODE_* compat)
│   ├── installation/index.ts      # Version, user agent, upgrade URLs
│   ├── config/config.ts           # Config file names, schema URL
│   ├── provider/provider.ts       # InnoGPT provider, HTTP headers
│   └── session/
│       ├── llm.ts                 # Request headers
│       └── prompt/*.txt           # Agent prompts
├── script/build.ts                # Build defines (INNOCODE_VERSION, etc.)
└── package.json                   # Package name, dependencies
```

### InnoGPT Provider Configuration

Added native InnoGPT provider in `packages/opencode/src/provider/provider.ts`:

```typescript
async innogpt(input) {
  const hasKey = await (async () => {
    const env = Env.all()
    if (input.env.some((item) => env[item])) return true
    if (await Auth.get(input.id)) return true
    const config = await Config.get()
    if (config.provider?.["innogpt"]?.options?.apiKey) return true
    return false
  })()

  return {
    autoload: hasKey,
    options: {
      baseURL: "https://app.innogpt.de/api/v1",
    },
  }
}
```

## Syncing with Upstream OpenCode

This repository is configured to sync with the original OpenCode repository.

### Repository Setup

```
origin   → https://github.com/Inno-ki/innocode.git     (this repo)
upstream → https://github.com/anomalyco/opencode.git  (original)
```

### Sync Workflow

#### 1. Check for Updates

```bash
# Fetch latest changes from OpenCode
git fetch upstream

# See what's new
git log main..upstream/main --oneline

# See detailed changes
git diff main..upstream/main --stat
```

#### 2. Merge Updates

```bash
# Make sure you're on main
git checkout main

# Merge upstream changes
git merge upstream/main
```

#### 3. Resolve Conflicts

Conflicts will typically occur in branding-related files. When resolving:

| File | Resolution |
|------|------------|
| `package.json` files | Keep `@innogpt/innocode-*` names, accept new dependencies |
| `README.md` | Keep InnoCode branding |
| `src/global/index.ts` | Keep `app = "innocode"` |
| `src/flag/flag.ts` | Keep dual `INNOCODE_`/`OPENCODE_` support |
| `src/provider/provider.ts` | Keep InnoGPT provider, accept other changes |
| `src/installation/index.ts` | Keep InnoCode URLs and branding |
| Other source files | Usually accept upstream changes |

#### 4. Push Updates

```bash
# Push merged changes
git push origin main
```

### Sync Script

Create `scripts/sync-upstream.sh` for convenience:

```bash
#!/bin/bash
set -e

echo "📥 Fetching upstream changes..."
git fetch upstream

CHANGES=$(git log main..upstream/main --oneline | wc -l | tr -d ' ')

if [ "$CHANGES" = "0" ]; then
    echo "✅ Already up to date with OpenCode"
    exit 0
fi

echo "📋 Found $CHANGES new commits from OpenCode:"
git log main..upstream/main --oneline

echo ""
read -p "🔀 Merge these changes? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git merge upstream/main || {
        echo ""
        echo "⚠️  Conflicts detected!"
        echo "   Resolve conflicts, then run:"
        echo "   git add . && git commit && git push origin main"
        exit 1
    }
    echo "✅ Successfully merged upstream changes"
    echo "   Run 'git push origin main' to publish"
fi
```

### Best Practices

1. **Sync regularly** - Check for upstream updates weekly to avoid large merge conflicts

2. **Test after syncing** - Run `bun install && bun run dev` to verify everything works

3. **Keep customizations minimal** - The fewer files you modify, the easier syncing will be

4. **Document changes** - Update this README when adding new customizations

5. **Use feature flags** - When possible, use environment variables instead of code changes

6. **Review upstream changelog** - Check OpenCode releases for breaking changes before merging

### Conflict-Prone Files

These files are customized and will likely conflict on merge:

```
High conflict risk (always keep ours):
├── README.md
├── package.json (root)
├── packages/opencode/package.json
├── packages/opencode/bin/innocode
├── packages/opencode/src/global/index.ts
├── packages/opencode/src/flag/flag.ts
├── packages/opencode/src/installation/index.ts
└── packages/opencode/src/provider/provider.ts

Medium conflict risk (merge carefully):
├── packages/opencode/src/config/config.ts
├── packages/opencode/src/session/llm.ts
├── packages/opencode/script/build.ts
└── packages/*/package.json

Low conflict risk (usually accept theirs):
└── Everything else
```

## Building

```bash
# Install dependencies
bun install

# Run in development
bun run dev

# Build for production (current platform only)
bun run --cwd packages/opencode script/build.ts --single

# Build for all platforms
bun run --cwd packages/opencode script/build.ts
```

## Publishing

```bash
# Build all platforms
bun run --cwd packages/opencode script/build.ts

# Publish to npm
npm publish --access public
```

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://innogpt.de">InnoGPT</a></sub>
</p>
