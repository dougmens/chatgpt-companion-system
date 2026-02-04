# SYSTEM_SPEC.md — Companion Bridge + Remote MCP Server (v1)

Stand: 2026-02-03
Scope: Remote MCP Server + Bridge MVP Phase 1 (file-based)

## 0. Ziel & Arbeitsweise

Ziel ist eine stabile, reproduzierbare Basis, damit Codex iterativ implementiert, ohne „alles auf einmal“.

* Source of Truth: diese Datei
* Jede Iteration = genau ein Abschnitt „JETZT UMSETZEN“
* Keine Umbauten außerhalb des expliziten Abschnitts
* Keine großen Refactors, nur zielgerichtete Änderungen

## 1. Repository-Kontext (gegeben)

Projekt: companion-system/remote-mcp-server

Technik:

* TypeScript, Build: tsc -> dist/
* ESM (package.json type=module)
* Start: node -r dotenv/config dist/server.js
* Server läuft lokal (health ok), MCP endpoint ok (derzeit via API-Key-Fallback getestet)

Wichtige Dateien:

* src/server.ts  (Express + oidc-provider + /mcp/intent)
* src/mcp/registry.ts (handleIntent)
* src/mcp/types/oidc-provider.d.ts (lokale Typen-Stub)
* .env (lokale ENV)

## 2. Bridge MVP Phase 1 (file-based) — Gesamtziel

Bridge ist eine ausführende Schicht (keine KI), die Intents verarbeitet und Daten persistiert.
Phase 1 umfasst:

* Intent-Inbox: JSON-Dateien in Ordner legen -> Bridge verarbeitet
* Persistenz: companion-json-v2 payloads in data/ speichern (minimaler Merge)
* Logging: jede Aktion als Zeile
* Post-Processing: Dateien nach processed/ verschieben

WICHTIG:

* Kein Dashboard-Open per Browser in Phase 1 (nur loggen)
* Kein Word/PDF/Acrobat in Phase 1

## 3. Ordnerstruktur (verbindlich)

Unter remote-mcp-server/ wird ein Ordner "companion-bridge" angelegt:

remote-mcp-server/
companion-bridge/
inbox/
processed/
data/
recht/
cases/
logs/

## 4. Erlaubte Intents (Phase 1)

Nur diese 4:

1. UPDATE_DASHBOARD_DATA
2. SHOW_DASHBOARD
3. FOCUS_ENTITY
4. PLAN_WORKFLOW

Alles andere:

* wird abgelehnt
* wird geloggt
* Datei wird nach processed/ verschoben (mit error marker im Dateinamen)

## 5. Datenformat (Phase 1 Minimal)

Die Bridge akzeptiert zwei Input-Formate:

### 5.1 Einfaches Intent-JSON

{
"intent": "UPDATE_DASHBOARD_DATA",
"domain": "recht",
"payload": { ... }
}

### 5.2 companion-json-v2 (voll)

Wenn payload.schema_version === "companion-json-v2":

* entities werden gemerged
* events werden appended (keine Duplikate)

## 6. JETZT UMSETZEN — Abschnitt 1 (Iteration 1)

### 6.1 Intent-Inbox (Dateibasiert)

Codex soll JETZT NUR DIESEN ABSCHNITT umsetzen.

Anforderungen:

* File-Watcher auf companion-bridge/inbox
* Nur *.json Dateien
* Datei exklusiv verarbeiten (kein Doppel-Processing)

Ablauf:

1. Datei erkennen
2. JSON parsen
3. intent validieren (Abschnitt 4)
4. Aktion anstoßen (noch Stub)
5. Log schreiben
6. Datei nach processed/ verschieben

Noch NICHT umsetzen:

* Persistenz-Logik
* MCP-Endpoint-Anbindung
* Dashboard-Deep-Links

## 7. Logging (Phase 1 verbindlich)

* Datei: companion-bridge/logs/bridge-YYYY-MM-DD.log
* Eine Zeile pro Aktion:
  ISO_TIMESTAMP | intent | domain | result

## 8. Stop-Regel für Codex

Wenn Abschnitt 6 vollständig implementiert ist:

* STOP
* KEINE weiteren Dateien anfassen
* KEINE Erweiterungen

---

END OF SYSTEM_SPEC.md
