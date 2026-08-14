#!/bin/bash
# DigitalOcean App Platform build script for Mestizo Umami
set -e

echo "==> Node $(node --version), npm $(npm --version)"

# Install pnpm if not present
if ! command -v pnpm &> /dev/null; then
  echo "==> Installing pnpm..."
  npm install -g pnpm@9
fi
echo "==> pnpm $(pnpm --version)"

# Install all workspace dependencies
# --no-frozen-lockfile: the lock file has linux-x64-only native binary pins;
# allow pnpm to resolve fresh on the DO build host
echo "==> Installing dependencies..."
pnpm install --no-frozen-lockfile

# Build the app
# BASE_PATH=/ because DO serves from the root (no path prefix)
# PORT=3000 is required by vite.config.ts (build still reads it)
echo "==> Building Mestizo Umami..."
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/mestizo-umami build

echo "==> Build complete. Output: artifacts/mestizo-umami/dist/public"
