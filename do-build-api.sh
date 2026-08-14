#!/bin/bash
# DigitalOcean App Platform build script for Mestizo Umami API Server
set -e

echo "==> Node $(node --version), npm $(npm --version)"

# Install pnpm if not present
if ! command -v pnpm &> /dev/null; then
  echo "==> Installing pnpm..."
  npm install -g pnpm@9
fi
echo "==> pnpm $(pnpm --version)"

# Install all workspace dependencies
echo "==> Installing dependencies..."
pnpm install --no-frozen-lockfile

# Build the API server (esbuild bundles into single dist/index.mjs)
echo "==> Building API Server..."
pnpm --filter @workspace/api-server build

echo "==> Build complete. Output: artifacts/api-server/dist/index.mjs"
