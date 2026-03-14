#!/bin/bash
set -e

# ── Ensure the "ours" merge driver is registered ──────────────────────
# This makes .gitattributes `merge=ours` work: branding files are kept
# as-is during upstream merges.
if ! git config merge.ours.driver >/dev/null 2>&1; then
    echo "Setting up 'ours' merge driver (one-time)..."
    git config merge.ours.driver true
fi

# ── Ensure upstream remote exists ─────────────────────────────────────
if ! git remote get-url upstream >/dev/null 2>&1; then
    echo "Adding upstream remote..."
    git remote add upstream https://github.com/anomalyco/opencode.git
fi

# ── Configuration ─────────────────────────────────────────────────────
UPSTREAM_BRANCH="production"  # OpenCode's stable release branch

# ── Fetch ─────────────────────────────────────────────────────────────
echo "Fetching upstream changes from OpenCode..."
git fetch upstream

CHANGES=$(git log main..upstream/$UPSTREAM_BRANCH --oneline | wc -l | tr -d ' ')

if [ "$CHANGES" = "0" ]; then
    echo "Already up to date with OpenCode."
    exit 0
fi

echo ""
echo "Found $CHANGES new commits from OpenCode:"
echo "----------------------------------------"
git log main..upstream/$UPSTREAM_BRANCH --oneline
echo "----------------------------------------"

echo ""
echo "Files changed:"
git diff main..upstream/$UPSTREAM_BRANCH --stat | tail -30

# ── Show which branding files would be touched ────────────────────────
BRANDING_FILES=(
    "README.md"
    "packages/opencode/package.json"
    "packages/opencode/src/global/index.ts"
    "packages/opencode/src/flag/flag.ts"
    "packages/opencode/src/installation/index.ts"
    "packages/opencode/src/provider/provider.ts"
)

TOUCHED_BRANDING=()
for f in "${BRANDING_FILES[@]}"; do
    if git diff main..upstream/$UPSTREAM_BRANCH --name-only | grep -q "^${f}$"; then
        TOUCHED_BRANDING+=("$f")
    fi
done

if [ ${#TOUCHED_BRANDING[@]} -gt 0 ]; then
    echo ""
    echo "Branding files changed upstream (will be KEPT as ours):"
    for f in "${TOUCHED_BRANDING[@]}"; do
        echo "  - $f"
    done
fi

echo ""
read -p "Merge these changes on a staging branch first? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# ── Merge on a staging branch ─────────────────────────────────────────
BRANCH="sync/upstream-$(date +%Y%m%d-%H%M%S)"
echo ""
echo "Creating staging branch: $BRANCH"
git checkout -b "$BRANCH"

echo "Merging upstream/$UPSTREAM_BRANCH..."
if git merge upstream/$UPSTREAM_BRANCH -m "Merge upstream OpenCode ($UPSTREAM_BRANCH) into InnoCode"; then
    echo ""
    echo "Merge completed cleanly."
else
    echo ""
    echo "Conflicts detected in the following files:"
    git diff --name-only --diff-filter=U
    echo ""
    echo "To resolve:"
    echo "  1. Edit the conflicting files"
    echo "  2. git add <files>"
    echo "  3. git commit"
    echo ""
    echo "Then continue with the steps below."
    echo ""
    echo "Tip: Branding files should keep OUR version."
    echo "     Feature code should accept THEIRS."
    exit 1
fi

# ── Verify ────────────────────────────────────────────────────────────
echo ""
echo "Running verification..."

VERIFY_FAILED=0

echo "  Checking types..."
if bun run typecheck >/dev/null 2>&1; then
    echo "  Typecheck passed."
else
    echo "  Typecheck FAILED — review before merging into main."
    VERIFY_FAILED=1
fi

echo "  Running tests..."
if bun run --cwd packages/opencode test >/dev/null 2>&1; then
    echo "  Tests passed."
else
    echo "  Tests FAILED — review before merging into main."
    VERIFY_FAILED=1
fi

if [ "$VERIFY_FAILED" -eq 1 ]; then
    echo ""
    echo "Verification failed. The merge is on branch: $BRANCH"
    echo "Fix the issues, then merge into main manually:"
    echo "  git checkout main"
    echo "  git merge $BRANCH"
    exit 1
fi

# ── Merge into main ──────────────────────────────────────────────────
echo ""
read -p "Verification passed. Merge $BRANCH into main? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git checkout main
    git merge "$BRANCH" --no-ff -m "Merge upstream OpenCode ($(date +%Y-%m-%d))"
    git branch -d "$BRANCH"

    echo ""
    echo "Successfully merged upstream changes into main."
    echo ""
    read -p "Push to origin? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin main
        echo "Pushed to origin/main."
    else
        echo "Run 'git push origin main' when ready."
    fi
else
    echo ""
    echo "Merge staged on branch: $BRANCH"
    echo "When ready:"
    echo "  git checkout main"
    echo "  git merge $BRANCH --no-ff"
    echo "  git branch -d $BRANCH"
    git checkout main
fi
