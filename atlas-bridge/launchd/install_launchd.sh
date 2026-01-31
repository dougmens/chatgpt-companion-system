#!/bin/bash
set -euo pipefail

SRC_DIR="/Users/andreasschonlein/companion-system/atlas-bridge/launchd"
DEST_DIR="$HOME/Library/LaunchAgents"

mkdir -p "$DEST_DIR"

cp "$SRC_DIR/com.companion.mcp.bridge.plist" "$DEST_DIR/"
cp "$SRC_DIR/com.companion.mcp.health.plist" "$DEST_DIR/"

launchctl unload "$DEST_DIR/com.companion.mcp.bridge.plist" 2>/dev/null || true
launchctl load "$DEST_DIR/com.companion.mcp.bridge.plist"

launchctl unload "$DEST_DIR/com.companion.mcp.health.plist" 2>/dev/null || true
launchctl load "$DEST_DIR/com.companion.mcp.health.plist"

echo "LaunchAgents installed and loaded."
