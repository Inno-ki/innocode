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

1. **Branding files** - These carry InnoCode customizations:
   - `README.md` — pure InnoCode (merge=ours)
   - `packages/core/src/global.ts` — app name "innocode" + legacy `~/.opencode/` migration (merge=ours)
   - `packages/core/src/flag/flag.ts` — `INNOCODE_` env-var prefix support (merge=ours)
   - `packages/opencode/package.json` — package name + `innocode` bin (manual rebase against upstream)
   - `packages/opencode/src/installation/index.ts` — URLs, formula names, brand strings (manual rebase against upstream)
   - `packages/opencode/src/provider/provider.ts` — InnoGPT custom loader and database registration (manual rebase against upstream)
   - `packages/opencode/src/provider/schema.ts` — `ProviderID.innogpt` (small additive patch)

2. **Feature code** - Can be synced from upstream OpenCode

3. **Sync workflow** - Run `./scripts/sync-upstream.sh` to pull updates from OpenCode

### Key Branding Differences from OpenCode

| OpenCode | InnoCode |
|----------|----------|
| `opencode` | `innocode` |
| `@opencode-ai/*` | `@opencode-ai/*` (internal, unchanged) |
| `opencode.json` | `innocode.json` |
| `~/.opencode/` | `~/.innocode/` |
| `OPENCODE_*` | `INNOCODE_*` (both work) |

### InnoGPT Provider

The InnoGPT provider is configured in `packages/opencode/src/provider/provider.ts`:

```typescript
async innogpt(input) {
  return {
    autoload: hasKey,
    options: {
      baseURL: "https://app.innogpt.de/api/v1",
    },
  }
}
```

Environment variable: `INNOGPT_API_KEY`

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
