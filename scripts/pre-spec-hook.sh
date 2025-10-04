#!/usr/bin/env bash
# Pre-spec hook - runs before /spec-compact

set -e

echo "📦 Checking context bundle..."

BUNDLE_DIR=".specify/bundles"
RECENT_BUNDLE=$(find "$BUNDLE_DIR" -name "*.jsonl" -mmin -10 | head -n 1)

if [ -z "$RECENT_BUNDLE" ]; then
    echo "⚠️  No recent context bundle found. Please save your context first."
    exit 1
fi

echo "✅ Context bundle is up to date!"
