# Checkpoint – Companion-System (Stand: 2026-02-04)

## Ziel
- Dashboard-First (A)
- GitHub Pages live unter: https://dougmens.github.io/chatgpt-companion-system/
- MCP SHOW_DASHBOARD soll diese URL zurückgeben (statt /cases)

## Erreicht
- Render: /health = 200 OK
- Auth per x-api-key funktioniert(e) zuvor (LIST_CAPABILITIES ok)
- GitHub Pages ist aktiviert (Source: GitHub Actions) und liefert 200 auf /chatgpt-companion-system/
- /cases ist 404 (korrekt, weil Project Pages)

## Problem aktuell
- Calls an /mcp/intent liefern wieder {"ok":false,"error":"Unauthorized"}
- Vermutung: lokale Shell hat MCP_API_KEY nicht gesetzt ODER Render ENV (ALLOW_API_KEY_FALLBACK/MCP_API_KEY) nicht aktiv / geändert / neuer Deploy
- Render zeigt in Events teils älteren Commit (62a8a04); GitHub ist weiter (b62a2d0)
- Need: Render auf latest deployen + DASHBOARD_URL env oder Code-Handler anpassen

## Relevante Endpoints
- https://chatgpt-companion-system.onrender.com/health
- https://chatgpt-companion-system.onrender.com/mcp/intent

## Render ENV (soll)
- ALLOW_API_KEY_FALLBACK=true
- MCP_API_KEY=<secret>
- (optional später) DASHBOARD_URL=https://dougmens.github.io/chatgpt-companion-system/

