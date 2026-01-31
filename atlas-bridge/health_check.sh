#!/bin/bash

STATUSFILE="/Users/andreasschonlein/companion-system/atlas-bridge/.status/mcp_status.json"
LOGFILE="/Users/andreasschonlein/companion-system/atlas-bridge/.logs/health.log"

if curl -s --max-time 2 http://localhost:3333/health > /dev/null
then
    echo "{\"status\":\"online\",\"timestamp\":\"$(date -Iseconds)\"}" > "$STATUSFILE"
    echo "[$(date)] MCP OK" >> "$LOGFILE"
else
    echo "{\"status\":\"offline\",\"timestamp\":\"$(date -Iseconds)\"}" > "$STATUSFILE"
    echo "[$(date)] MCP NOT RESPONDING — restarting agent" >> "$LOGFILE"
    launchctl stop com.companion.mcp.bridge
    launchctl start com.companion.mcp.bridge
fi
