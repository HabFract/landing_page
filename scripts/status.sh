#!/usr/bin/env bash
# Status check for habfract-landing-page

echo "📊 habfract-landing-page Status"
echo "=============================="
echo ""




echo "📘 TypeScript:"
node --version 2>/dev/null || echo "  Not installed"
npm --version 2>/dev/null || echo "  Not installed"
echo ""




echo "📁 Project Structure:"
ls -la .claude/ 2>/dev/null && echo "  ✅ .claude/" || echo "  ❌ .claude/"

ls -la .specify/ 2>/dev/null && echo "  ✅ .specify/" || echo "  ❌ .specify/"

ls -la scripts/ 2>/dev/null && echo "  ✅ scripts/" || echo "  ❌ scripts/"
echo ""


echo "📡 Archon Status:"
if curl -s http://localhost:8181/health > /dev/null 2>&1; then
    echo "  ✅ Connected to http://localhost:8181"
else
    echo "  ❌ Not connected to http://localhost:8181"
fi
echo ""


echo "Git Status:"
git status --short 2>/dev/null || echo "  Not a git repository"
