#!/bin/bash

PYTHON="/Users/andreasschonlein/companion-system/atlas-bridge/venv/bin/python"
SERVER="/Users/andreasschonlein/companion-system/atlas-bridge/server.py"
LOGDIR="/Users/andreasschonlein/companion-system/atlas-bridge/.logs"
STATUSDIR="/Users/andreasschonlein/companion-system/atlas-bridge/.status"

mkdir -p "$LOGDIR"
mkdir -p "$STATUSDIR"

while true
do
    echo "[$(date)] Starting MCP Server..." >> "$LOGDIR/watchdog.log"
    "$PYTHON" "$SERVER" >> "$LOGDIR/mcp.out.log" 2>> "$LOGDIR/mcp.err.log"
    echo "[$(date)] MCP crashed. Restarting in 2 seconds..." >> "$LOGDIR/watchdog.log"
    sleep 2
done
