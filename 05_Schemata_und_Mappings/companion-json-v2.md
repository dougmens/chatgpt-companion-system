# companion-json-v2 – Datenschema

## Status
Kanonisch · verbindlich · systemweit gültig

## Zweck dieses Dokuments
Dieses Dokument definiert das **verbindliche Datenschema `companion-json-v2`**
für den Austausch von Zuständen, Ereignissen (Events), Entitäten (Entities),
Dashboards und Intents im Companion-System.
Ziel ist **Eindeutigkeit, Validierbarkeit und langfristige Stabilität**.

Bei Widersprüchen gilt:
1. Companion-System_Gesamtuebersicht.md
2. Systemarchitektur.md
3. Governance.md
4. Dieses Dokument
5. Code

---

## 1. Grundprinzipien

- **Events = Wahrheit** (unveränderlich, zeitlich geordnet)
- **Entities = Snapshot** (aktueller Zustand, aus Events abgeleitet)
- **IDs sind stabil** (nie recyceln)
- **Zeitstempel ISO-8601 mit Zeitzone**
- **Erweiterungen ausschließlich unter `extensions`**

---

## 2. Top-Level-Struktur

Pflichtfelder auf oberster Ebene:

- `schema_version`
- `generated_at`
- `events`
- `entities`
- `dashboards`
- `intents`

Optionale Felder:
- `extensions`

---

## 3. Felddefinitionen (Top-Level)

schema_version:
- Typ: string
- Wert: `companion-json-v2`

generated_at:
- Typ: string
- Format: ISO-8601 (mit Zeitzone)

events:
- Typ: array
- Inhalt: Ereignisse (append-only)

entities:
- Typ: object
- Inhalt: aktuelle Zustände je Entitätstyp

dashboards:
- Typ: object
- Inhalt: Dashboard-Referenzen und Metadaten

intents:
- Typ: array
- Inhalt: auszuführende Steuerungsintents

extensions:
- Typ: object
- Inhalt: optionale, schemafremde Erweiterungen

---

## 4. Events

### 4.1 Zweck
Events protokollieren **jede relevante Veränderung** im System.
Sie sind **unveränderlich** und werden **niemals gelöscht oder überschrieben**.

### 4.2 Pflichtfelder je Event

- `event_id` (string, stabil)
- `type` (string)
- `timestamp` (ISO-8601)
- `actor` (string)
- `payload` (object)

### 4.3 Regeln

- Events werden **nur angehängt**
- Reihenfolge ist zeitlich
- Korrekturen erfolgen durch **neues Event**

---

## 5. Entities

### 5.1 Zweck
Entities repräsentieren den **aktuellen Zustand** eines Objekts
(z. B. Fall, Aufgabe, Dokument).

### 5.2 Regeln

- Entities werden **aus Events abgeleitet**
- Entities dürfen **überschrieben** werden
- Jede Entity besitzt eine **stabile ID**

---

## 6. Dashboards

### 6.1 Zweck
Dashboards sind **externe Visualisierungen**.
ChatGPT ist **reiner Orchestrator**, nicht UI.

### 6.2 Inhalte

- Dashboard-ID
- Domain (z. B. recht, finanzen)
- URL
- optionale Metadaten

---

## 7. Intents

### 7.1 Zweck
Intents steuern **externe Aktionen** (Dashboard öffnen, Fokus setzen, Workflow planen).

### 7.2 Reihenfolge (verbindlich)

1. UPDATE_DASHBOARD_DATA  
2. SHOW_DASHBOARD  
3. FOCUS_ENTITY  
4. PLAN_WORKFLOW  

Diese Reihenfolge darf **nicht verletzt** werden.

---

## 8. Extensions

- Erweiterungen **nur** unter `extensions`
- Kernschema bleibt unverändert
- Jede Extension ist dokumentationspflichtig

---

## 9. Validierungsregeln

- Pflichtfelder müssen vorhanden sein
- Datentypen müssen eingehalten werden
- Unbekannte Felder außerhalb von `extensions` sind unzulässig

---

## 10. Geltung

Dieses Schema gilt:
- systemweit
- rollenübergreifend
- dauerhaft

Änderungen erfolgen ausschließlich gemäß `Governance.md`.
