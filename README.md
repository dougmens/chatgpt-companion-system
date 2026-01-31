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

## Schnellstart (kurz)
Die UIs sind Vite/React‑Projekte. Standard‑Ablauf pro UI‑Ordner:
1) Abhängigkeiten installieren
2) Dev‑Server starten

Wenn du möchtest, ergänze ich hier **konkrete Start‑Befehle** pro Projekt.

## Hinweise
- Auto‑generierte Dateien (z. B. `node_modules/`, `dist/`, `venv/`) sind **ignoriert**.
- Bitte keine Ergebnisdokumente (PDF/DOCX) in dieses Repo legen – siehe `00_README.md`.
