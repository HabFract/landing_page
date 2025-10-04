#!/usr/bin/env bash
# Pre-lint hook - runs before /lint-and-commit
# This script detects which tools are needed and runs them

set -e

echo "🔍 Running linters and formatters..."
echo ""

# TypeScript/JavaScript linting with Biome
if [ -f "package.json" ]; then
  echo "📦 Checking TypeScript/JavaScript with Biome..."

  # Check if biome is available
  if command -v biome &> /dev/null || npx --yes biome --version &> /dev/null; then
    npx biome check --write . || { echo "❌ biome check failed"; exit 1; }
  else
    echo "⚠️  Biome not found. Install it with: npm install --save-dev @biomejs/biome"
    # Fallback to npm scripts if they exist
    if grep -q '"lint"' package.json; then
      echo "Running npm run lint as fallback..."
      npm run lint || { echo "❌ npm run lint failed"; exit 1; }
    fi
  fi
fi

echo ""
echo "✅ All checks passed!"
