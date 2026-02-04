# MASTER_MD – Companion-System

## Version
- Schema: **companion-json-v2** (gepinned)
- Stand: 2026-02-02
- Rolle: Companion.Andreas (Meta-Orchestrator)

---

## 1. Ziel & Leitprinzipien

Dieses Dokument ist die **verbindliche Referenz** für:
- Architektur
- Dateisystem-Logik
- Datenformate
- Intent-Steuerung
- Trennung von Chat, Dashboard und Automation

**Grundsätze:**
- Chat = Denken, Strukturieren, Entscheiden
- Dashboard = Visualisieren, Überwachen, Navigieren
- Automationen = Ausführen
- **Keine UI-Simulation im Chat**
- Steuerung ausschließlich über **strukturierte Intents**
- Einheitliches Datenformat: `companion-json-v2`

---

## 2. System-Root & Dateipolitik (VERBINDLICH)

### 2.1 System-Root (Single Source of Truth)

Das Companion-System liegt **nicht** unter `~/Documents`.

**Verbindlicher Root:**
```
/Users/andreasschonlein/companion-system/
```

---

### 2.2 Externe Ordner (NICHT Teil des Systems)

Folgende Orte sind **keine Systembestandteile**:
- `~/Documents`
- iCloud Drive
- Google Drive
- OneDrive
- Downloads

Sie dienen **ausschließlich** als:
- **Import-Quellen**
- **Export-Ziele**

---

### 2.3 Verbindliche Systemstruktur

```
companion-system/
├─ data/
├─ inbox/
├─ processed/
├─ logs/
├─ output/
├─ atlas-bridge/
├─ mcp-server/
├─ REACT-UI-Dashboards/
└─ config/
```

---

### 2.4 Pfad-Regeln (hart)

- Keine hartcodierten `~/Documents/...` Pfade
- Root muss zentral definiert sein

---

## 3. Rollen- & Domain-Modell (Kurzfassung)

**Companion.Andreas** – Meta-Orchestrator  
Weitere Rollen siehe Rollenlogik.md

---

## 4. Datenformat: companion-json-v2

```json
{
  "schema_version": "companion-json-v2",
  "meta": {},
  "entities": [],
  "events": [],
  "links": [],
  "intents": [],
  "extensions": {}
}
```

---

## 5. Intents (verbindlich)

- UPDATE_DASHBOARD_DATA
- SHOW_DASHBOARD
- FOCUS_ENTITY
- PLAN_WORKFLOW

Reihenfolge:
1. UPDATE_DASHBOARD_DATA
2. SHOW_DASHBOARD
3. FOCUS_ENTITY
4. PLAN_WORKFLOW

---

## 6. Zielzustand

Ein stabiles, pfadsauberes, agententaugliches Companion-System.
