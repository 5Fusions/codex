#!/usr/bin/env bash
set -euo pipefail

# Launch the Primator copilot profile quickly.
# - Ensures codex CLI is installed
# - Copies the Primator example config to ~/.codex/config.toml if missing
# - Runs codex with the Primator profile (additional args are passed through)

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXAMPLE_CONFIG="$ROOT/docs/primator-config.example.toml"
CONFIG_DIR="$HOME/.codex"
CONFIG_FILE="$CONFIG_DIR/config.toml"

if ! command -v codex >/dev/null 2>&1; then
  echo "codex CLI not found on PATH. Install it (e.g., brew install codex or npm i -g @openai/codex) and retry." >&2
  exit 1
fi

if [ ! -f "$EXAMPLE_CONFIG" ]; then
  echo "Primator example config missing at $EXAMPLE_CONFIG. Make sure you cloned the docs folder or reinstall." >&2
  exit 1
fi

mkdir -p "$CONFIG_DIR"

if [ ! -f "$CONFIG_FILE" ]; then
  cp "$EXAMPLE_CONFIG" "$CONFIG_FILE"
  echo "Primator config copied to $CONFIG_FILE" >&2
else
  echo "Using existing config at $CONFIG_FILE" >&2
fi

echo "Starting Primator (command-only). Additional arguments will be passed through to codex." >&2
exec codex --profile primator "$@"
