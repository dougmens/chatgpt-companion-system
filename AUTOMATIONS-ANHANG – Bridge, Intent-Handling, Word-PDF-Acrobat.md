# AUTOMATIONS-ANHANG – Bridge, Intent-Handling, Word/PDF/Acrobat

## Zweck
Dieser Anhang definiert die **verbindliche Automations-Schicht** zwischen:
- ChatGPT (Companion.Andreas + Fachrollen)
- externen Dashboards
- lokalen Tools (Word, PDF, Adobe Acrobat)

Die Automationen **setzen Entscheidungen um**, sie treffen keine.

---

## 1. System-Root & Grundsatz (VERBINDLICH)

### 1.1 System-Root
Alle Automationen arbeiten **ausschließlich** relativ zu folgendem Root:

```
/Users/andreasschonlein/companion-system/
```

### 1.2 Externe Ordner
`~/Documents`, iCloud, Google Drive etc. sind **keine Systembestandteile**.  
Sie dürfen nur als **Import** oder **Export** dienen.

**Verboten:**
- persistente Datenhaltung außerhalb des System-Roots
- Logfiles außerhalb des System-Roots
- temporäre Arbeitsdateien in Documents

---

## 2. Verbindliche Ordnerstruktur

```
companion-system/
├─ inbox/                  # eingehende Intents
├─ processed/              # abgearbeitete Intents
├─ data/                   # companion-json-v2 Persistenz
│  ├─ recht/
│  ├─ finanzen/
│  ├─ organisation/
│  └─ projekt/
├─ logs/                   # Audit- & Fehlerlogs
├─ output/                 # generierte Dateien
│  ├─ word/
│  └─ pdf/
├─ atlas-bridge/
└─ config/
```

---

## 3. Grundprinzip: Chat → Intent → Bridge → Aktion

### 3.1 ChatGPT liefert
- strukturierte **Intents**
- optional `companion-json-v2`

### 3.2 Bridge
- validiert Intents
- routet Aktionen
- führt **deterministisch** aus
- loggt **jede** Aktion

---

## 4. Bridge-Komponenten

1. **Intent-Inbox**
   - Datei- oder HTTP-basiert

2. **Validator**
   - JSON-Syntax
   - Intent-Typ
   - Schema-Version

3. **Router**
   - Intent → Handler

4. **Handler**
   - DashboardHandler
   - DataStoreHandler
   - DocAutopilotHandler
   - AcrobatHandler

5. **Audit-Log**
   - Zeit
   - Input
   - Ergebnis

---

## 5. Data Store (verbindlich)

- Format: `companion-json-v2`
- Speicherort: `/data/<domain>/`

**Regeln:**
- Entities = Zustand
- Events = Wahrheit
- Kein Überschreiben ohne Event

---

## 6. Dokument-Autopilot (Word → PDF)

### 6.1 Ziel
- Word-Vorlage öffnen
- Platzhalter füllen
- DOCX + PDF erzeugen
- im System-Root ablegen

### 6.2 Ablage
```
/output/word/
/output/pdf/
```

### 6.3 Dateinamensregel
**MM-YY Absender – Dokumentart – Inhalt.ext**

---

## 7. Acrobat-Anlagen-Automat

- sammelt Anlagen aus `/data/`
- prüft Vollständigkeit
- erzeugt Anlagen-PDF
- optional Versandpaket

---

## 8. Sicherheitsregeln (hart)

- nur lokale Pfade
- keine stillen Änderungen
- vollständiges Logging
- Schema-Pinning

---

## 9. Minimaler Startmodus

1. Datei-Inbox
2. Dateibasierter Store
3. Logging aktiv
4. keine Netzwerkabhängigkeiten

---

## 10. Ergebnis

Eine **stabile, nachvollziehbare, revisionssichere** Automations-Schicht,
die langfristig erweiterbar bleibt.
