# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**InnoCode** is InnoGPT's fork of [OpenCode](https://github.com/anomalyco/opencode), an open-source AI coding agent for the terminal. This fork is pre-configured to work with the InnoGPT API.

**Stack:** Bun, TypeScript, Solid.js (TUI), AI SDK

## Development Commands

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Type checking
bun run typecheck

# Build for current platform
bun run --cwd packages/opencode script/build.ts --single

# Build for all platforms
bun run --cwd packages/opencode script/build.ts

# Run tests
bun run --cwd packages/opencode test
```

## Project Structure

```
innocode/
├── packages/
│   ├── opencode/          # Main CLI application (core package)
│   │   ├── bin/           # CLI entry point (innocode binary)
│   │   ├── src/
│   │   │   ├── agent/     # AI agent definitions
│   │   │   ├── cli/       # CLI commands and TUI
│   │   │   ├── config/    # Configuration management
│   │   │   ├── flag/      # Environment variable flags
│   │   │   ├── global/    # Global constants and paths
│   │   │   ├── installation/ # Version and upgrade management
│   │   │   ├── mcp/       # Model Context Protocol
│   │   │   ├── plugin/    # Plugin system
│   │   │   ├── provider/  # AI provider integrations
│   │   │   ├── session/   # Chat session management
│   │   │   └── tool/      # AI tools (file ops, bash, etc.)
│   │   └── script/        # Build and publish scripts
│   ├── app/               # Shared UI components (Solid.js)
│   ├── ui/                # UI component library
│   ├── sdk/               # JavaScript SDK
│   ├── plugin/            # Plugin SDK
│   └── desktop/           # Desktop app (Tauri)
├── scripts/
│   └── sync-upstream.sh   # Script to sync with OpenCode
└── infra/                 # SST infrastructure
```

## Fork-Specific Information

### This is a Fork of OpenCode

When making changes, be aware:

1. **Branding files** - These carry InnoCode customizations (paths current as of the
   Jul 2026 upstream sync, after the monorepo `core`/`cli`/`tui`/`llm` split):
   - `README.md` — pure InnoCode (merge=ours)
   - `packages/core/src/global.ts` — app name "innocode" + legacy `~/.opencode/` migration (**merge=ours — see hazard below**)
   - `packages/core/src/flag/flag.ts` — `INNOCODE_` env-var prefix support via `getEnv()` (**merge=ours — see hazard below**)
   - `packages/opencode/package.json` — package name + `innocode` bin (manual rebase against upstream)
   - `packages/opencode/src/installation/index.ts` — URLs, formula names, brand strings (manual rebase against upstream)
   - `packages/opencode/src/provider/provider.ts` — InnoGPT custom loader (uses `ProviderV2.ID`/`ModelV2.ID`) + models.dev placeholder + state discovery + innogpt exempt from the zero-models drop + `defaultModelIDs` skips empty providers (manual rebase against upstream)
   - `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` — injects the InnoGPT placeholder into the `provider.list` response (**this was silently lost in the Jul 2026 restructure** — the old `server/routes/provider.ts` carried it and upstream deleted that file; without it InnoGPT can never be selected in the connect dialog)
   - `packages/opencode/src/cli/cmd/providers.ts` — InnoGPT injected into the `auth login` menu, top priority + "recommended" hint (manual rebase against upstream)
   - `packages/opencode/src/config/config.ts` — `enabled_providers` defaults to `["innogpt"]` (escape hatch `INNOCODE_ALL_PROVIDERS=1`, set by the test preload), `innocode.json(c)` config filename support, `INNOCODE_CONFIG_CONTENT` support (manual rebase against upstream)
   - `packages/opencode/test/server/httpapi-innogpt.test.ts` — regression tests guarding the three customizations above (InnoCode-only file, no upstream conflict)
   - `packages/opencode/test/preload.ts` / `packages/opencode/test/lib/cli-process.ts` — set `INNOCODE_ALL_PROVIDERS=1` so upstream tests see the full provider catalog (manual rebase against upstream)
   - `packages/tui/src/logo.ts` — InnoCode ASCII logo rendered by the TUI (manual rebase; upstream moved the logo into the `tui` package)
   - `packages/app/src/desktop-menu.ts` — macOS app menu label "InnoCode" (upstream made the desktop menu data-driven; the old `main/menu.ts` template is gone)
   - `packages/core/src/oauth/page.ts` — InnoCode copy on the MCP OAuth callback page (upstream centralised this; the old inline HTML in `mcp/oauth-callback.ts` is gone)
   - `packages/desktop/electron-builder.innocode.config.ts` — unsigned-build wrapper + `productName: "InnoCode"` (InnoCode-only file, no upstream conflict)
   - `packages/desktop/src/main/index.ts` — `APP_NAMES` ("InnoCode") and `app.setName` fallback (manual rebase against upstream)
   - `packages/desktop/src/main/windows.ts` — `BrowserWindow` `title: "InnoCode"` (manual rebase against upstream)
   - `packages/app/index.html` / `packages/ui/src/assets/favicon/site.webmanifest` — `<title>`/manifest name "InnoCode"
   - `packages/web/config.mjs` — InnoCode URLs + Vercel deploy logic
   - `packages/app/src/hooks/use-providers.ts` — InnoGPT listed as recommended provider
   - `.github/workflows/desktop-release.yml` — InnoCode-only Electron release pipeline (no upstream conflict)
   - `packages/web/src/pages/download/` — InnoCode download page + proxy route (no upstream conflict)

   > **merge=ours hazard:** `global.ts` and `flag.ts` are marked `merge=ours` in
   > `.gitattributes`, so upstream changes to them are silently discarded during a
   > merge. When upstream adds/renames exports in these files (e.g. `flag.ts`'s
   > exported `truthy`, `global.ts`'s `node`/`repos`), the app breaks at runtime with
   > missing-export errors. After every sync, diff these two files against
   > `upstream/production` and re-base our small customizations (`getEnv()` prefix
   > logic; `app="innocode"` + `~/.innocode` migration) onto upstream's version.
   > `ProviderID.innogpt` in the old `provider/schema.ts` is no longer needed —
   > the loader uses `ProviderV2.ID.make("innogpt")`.

2. **Feature code** - Can be synced from upstream OpenCode

3. **Sync workflow** - Run `./scripts/sync-upstream.sh` to pull updates from OpenCode

### Key Branding Differences from OpenCode

| OpenCode | InnoCode |
|----------|----------|
| `opencode` | `innocode` |
| `@opencode-ai/*` | `@opencode-ai/*` (internal, unchanged) |
| `opencode.json` | `innocode.json` (both filenames load; `innocode.*` wins) |
| all providers visible | only InnoGPT visible by default (`enabled_providers` defaults to `["innogpt"]`; override via config or `INNOCODE_ALL_PROVIDERS=1`) |
| `~/.opencode/` | `~/.innocode/` |
| `OPENCODE_*` | `INNOCODE_*` (both work) |

### InnoGPT Provider

The InnoGPT provider is registered in `packages/opencode/src/provider/provider.ts` and
shows up as a recommended provider in the desktop UI
(`packages/app/src/hooks/use-providers.ts`).

Default base URL: `https://app.innogpt.de/api/ext/v1`
(overridable via `provider.innogpt.options.baseURL` in `innocode.json`)

API key resolution order:
1. `INNOGPT_API_KEY` environment variable
2. Stored auth (`innocode auth login innogpt`)
3. `provider.innogpt.options.apiKey` in `innocode.json`

Models are auto-discovered from `${baseURL}/models` with `Authorization: Bearer <key>`.

## Code Style

- TypeScript everywhere
- Use `bun` as the runtime and package manager
- Solid.js for UI components
- Zod for schema validation
- Use existing patterns from the codebase

### Naming Conventions

- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Functions/variables: `camelCase`
- Environment variables: `SCREAMING_SNAKE_CASE`
- Use `INNOCODE_` prefix for new env vars (not `OPENCODE_`)

## Important Files

### Configuration
- `packages/opencode/src/config/config.ts` - Config schema and loading
- Config files: `innocode.json` or `innocode.jsonc`

### Providers
- `packages/opencode/src/provider/provider.ts` - Provider definitions
- `packages/opencode/src/provider/models.ts` - Model definitions

### CLI & TUI
- `packages/opencode/src/cli/` - CLI commands
- `packages/opencode/src/cli/cmd/tui/` - Terminal UI

### AI Tools
- `packages/opencode/src/tool/` - Tool definitions (bash, file ops, etc.)

### Session & Chat
- `packages/opencode/src/session/` - Chat session management
- `packages/opencode/src/session/llm.ts` - LLM streaming
- `packages/opencode/src/session/prompt/` - System prompts

## Environment Variables

### InnoGPT Specific
- `INNOGPT_API_KEY` - InnoGPT API key

### General (INNOCODE_ or OPENCODE_ prefix)
- `INNOCODE_CONFIG` - Custom config file path
- `INNOCODE_DISABLE_AUTOUPDATE` - Disable auto-updates
- `INNOCODE_EXPERIMENTAL` - Enable experimental features
- `INNOCODE_DISABLE_MODELS_FETCH` - Don't fetch models.dev

## Testing

```bash
# Run all tests
bun run --cwd packages/opencode test

# Run specific test file
bun run --cwd packages/opencode test path/to/test.ts
```

## Building & Publishing

```bash
# Build single platform (for testing)
bun run --cwd packages/opencode script/build.ts --single

# Build all platforms
bun run --cwd packages/opencode script/build.ts

# The build output is in packages/opencode/dist/
```

## Syncing with Upstream OpenCode

```bash
# Check for updates
git fetch upstream
git log main..upstream/main --oneline

# Interactive sync
./scripts/sync-upstream.sh

# Manual sync
git fetch upstream
git merge upstream/main
# Resolve conflicts, keeping our branding
git push origin main
```

## Common Tasks

### Adding a New Provider
1. Add provider config in `packages/opencode/src/provider/provider.ts`
2. Add to `CUSTOM_LOADERS` if special handling needed
3. Document in README

### Modifying System Prompts
- Edit files in `packages/opencode/src/session/prompt/`
- Prompts are per-provider (anthropic.txt, gemini.txt, etc.)

### Adding New Tools
1. Create tool in `packages/opencode/src/tool/`
2. Register in tool registry
3. Add to appropriate agent configurations

### Updating Branding
When updating branding, ensure consistency across:
- `packages/opencode/src/global/index.ts`
- `packages/opencode/src/installation/index.ts`
- `packages/opencode/src/flag/flag.ts`
- All `package.json` files
- `README.md`
