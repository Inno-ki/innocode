# Upstream Sync (OpenCode → InnoCode)

Keep InnoCode close to upstream with a lightweight merge routine.

## Weekly Sync Steps
1. Fetch upstream:
   ```bash
   git fetch upstream
   ```
2. Merge upstream into `main`:
   ```bash
   git checkout main
   git merge upstream/main
   ```
3. Resolve conflicts (expected hotspots):
   - Branding/docs: `packages/web`, `packages/web/src/content/docs`
   - Provider overrides: `packages/opencode/src/config/config.ts`
   - Provider overrides: `packages/opencode/src/provider/provider.ts`
   - Provider overrides: `packages/opencode/src/server/routes/provider.ts`
4. Run checks:
   ```bash
   bun turbo typecheck
   bun run --cwd packages/web build
   ```
5. Tag and release after green checks.

## Notes
- Avoid refactors in shared core logic to reduce merge pain.
- Keep InnoCode changes at the edges (brand, docs, provider gate).
- If a conflict is non-trivial, prefer reapplying a small local patch after the merge.
