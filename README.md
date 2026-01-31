# ChatGPT Companion System

Dieses Repository enthält **Quellcode und Dokumentation** für das Companion‑System.
Die **kanonische Systembeschreibung** findest du in `00_README.md`.

## Was ist hier drin?
- **System‑Doku:** Regeln, Definitionen, Rollen, Mappings
- **Fallakten‑Meta:** Strukturierte Meta‑Infos (nur `.md`)
- **UI‑Frontends:** Zwei React‑UIs
- **Backend/Bridge:** Python‑Server für Integrationen

## Wichtige Ordner (Kurzüberblick)
- `00_README.md` → wichtigste Regeln & Trennlinien
- `01_Setup_und_Definitionen/` → Begriffe, Governance, Architektur
- `02_Arbeitsregeln_und_Leitfaeden/` → Leitfäden & Checklisten
- `03_Fallakten_Meta/` → Meta‑Daten zu Fällen
- `04_Agenten_und_Rollen/` → Zuständigkeiten & Rollen
- `05_Schemata_und_Mappings/` → Schemata/Mappings
- `06_Logs_und_Protokolle/` → Protokolle (nur wenn nötig)
- `07_Vorlagen_und_Dokument-Master/` → Vorlagen
- `atlas-bridge/` → Python‑Backend
- `companion-frontend/` → Haupt‑Frontend (React)
- `REACT-UI-Dashboards/` → Dashboard‑UI (React)

## Voraussetzungen
- Node.js (fuer die React‑UIs)
- Python 3 (fuer `atlas-bridge/`)

## Schnellstart
### companion-frontend
```bash
cd companion-frontend
npm install
npm run dev
```

### REACT-UI-Dashboards
```bash
cd REACT-UI-Dashboards
npm install
npm run dev
```

### atlas-bridge (Python)
```bash
cd atlas-bridge
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

## Hinweise
- Auto‑generierte Dateien (z. B. `node_modules/`, `dist/`, `venv/`) sind **ignoriert**.
- Bitte keine Ergebnisdokumente (PDF/DOCX) in dieses Repo legen – siehe `00_README.md`.


## Autostart (launchd)
Die Templates liegen unter `atlas-bridge/launchd/`.

Beispiel-Setup:
```bash
cp atlas-bridge/launchd/com.companion.mcp.bridge.plist ~/Library/LaunchAgents/
cp atlas-bridge/launchd/com.companion.mcp.health.plist ~/Library/LaunchAgents/
launchctl unload ~/Library/LaunchAgents/com.companion.mcp.bridge.plist 2>/dev/null
launchctl load ~/Library/LaunchAgents/com.companion.mcp.bridge.plist
launchctl unload ~/Library/LaunchAgents/com.companion.mcp.health.plist 2>/dev/null
launchctl load ~/Library/LaunchAgents/com.companion.mcp.health.plist
```

Statusdatei fuer das Dashboard:
`/Users/andreasschonlein/companion-system/atlas-bridge/.status/mcp_status.json`

