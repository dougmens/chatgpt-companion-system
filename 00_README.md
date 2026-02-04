# 00_README – Schnellstart (Human & Agent Entry Point)

## Zweck
Diese Datei ist der **Einstiegspunkt** für:
- neue Agenten
- externe Tools
- zukünftige Automationen
- Menschen, die das System erstmals öffnen

Sie ist **kurz**, **orientierend** und verweist auf die maßgeblichen Dokumente.

---

## System-Root (verbindlich)

```
/Users/andreasschonlein/companion-system/
```

> ⚠️ Das System liegt **nicht** unter `~/Documents`.

---

## Was ist dieses System?

Das Companion-System ist ein **strukturierter KI-Orchestrator**:
- ChatGPT denkt und entscheidet
- Dashboards visualisieren
- Automationen führen aus
- Daten bleiben lokal und konsistent

---

## Zentrale Dokumente (lesen in dieser Reihenfolge)

1. **MASTER_MD – Companion-System.md**  
   → Oberste Referenz (Architektur, Regeln, Pfade)

2. **AUTOMATIONS-ANHANG – Bridge, Intent-Handling, Word-PDF-Acrobat.md**  
   → Wie Entscheidungen technisch umgesetzt werden

3. **README.md**  
   → Überblick & Ordnerstruktur

---

## Kurzregeln (hart)

- Keine Arbeit außerhalb des System-Roots
- Keine stillen Annahmen
- Steuerung nur über strukturierte Intents
- `companion-json-v2` ist gepinnt
- Events = Wahrheit, Entities = Zustand

---

## Ordner-Mindestverständnis

```
data/        → Persistente Systemdaten
inbox/       → Eingehende Intents
processed/   → Abgearbeitete Intents
logs/        → Audit & Fehler
output/      → Generierte Dateien
```

---

## Für Agenten

- Lies **MASTER_MD zuerst**
- Verwende keine absoluten Pfade außerhalb des Roots
- Erzeuge keine UI im Chat
- Halte dich strikt an Intent-Reihenfolge

---

## Für Menschen

- Dieses System ersetzt kein Denken
- Es erzwingt Struktur und Klarheit
- Es ist absichtlich streng

---

## Ziel

Ein **robustes, wartbares, langfristiges** Companion-System,
das nicht durch implizite Annahmen zerfällt.
