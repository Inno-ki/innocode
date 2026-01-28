#!/bin/bash
set -e

echo "📥 Fetching upstream changes from OpenCode..."
git fetch upstream

CHANGES=$(git log main..upstream/main --oneline | wc -l | tr -d ' ')

if [ "$CHANGES" = "0" ]; then
    echo "✅ Already up to date with OpenCode"
    exit 0
fi

echo ""
echo "📋 Found $CHANGES new commits from OpenCode:"
echo "----------------------------------------"
git log main..upstream/main --oneline
echo "----------------------------------------"

echo ""
echo "📁 Files changed:"
git diff main..upstream/main --stat | tail -20

echo ""
read -p "🔀 Merge these changes? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 Merging upstream/main..."
    git merge upstream/main || {
        echo ""
        echo "⚠️  Conflicts detected!"
        echo ""
        echo "Conflicting files:"
        git diff --name-only --diff-filter=U
        echo ""
        echo "📝 To resolve:"
        echo "   1. Edit the conflicting files"
        echo "   2. git add ."
        echo "   3. git commit"
        echo "   4. git push origin main"
        echo ""
        echo "💡 Tip: For branding files (README.md, package.json, etc.),"
        echo "   keep OUR version. For feature code, accept THEIRS."
        exit 1
    }
    echo ""
    echo "✅ Successfully merged upstream changes!"
    echo ""
    read -p "🚀 Push to origin? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin main
        echo "✅ Pushed to origin/main"
    else
        echo "💡 Run 'git push origin main' when ready"
    fi
fi
