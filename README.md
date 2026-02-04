# Companion-System – README

## Zweck
Dieses Repository enthält das **Companion-System** von Andreas Schönlein.
Es definiert Architektur, Rollen, Datenformate und Automationen für ein
langfristig stabiles, agententaugliches KI-Assistenzsystem.

---

## System-Root (verbindlich)

Der **einzige gültige System-Root** ist:

```
/Users/andreasschonlein/companion-system/
```

Das System liegt **nicht** unter `~/Documents`.

---

## Wichtige Grundsätze

- ChatGPT = Denken, Strukturieren, Entscheiden
- Dashboards = Visualisierung (read-only)
- Automationen = Ausführen
- Keine UI-Simulation im Chat
- Steuerung ausschließlich über strukturierte Intents
- Einheitliches Datenformat: `companion-json-v2`

---

## Ordnerübersicht

```
companion-system/
├─ MASTER_MD – Companion-System.md        # Oberste Referenz
├─ AUTOMATIONS-ANHANG – Bridge, Intent-Handling, Word-PDF-Acrobat.md
├─ data/                                  # Persistente Systemdaten
├─ inbox/                                 # eingehende Intents
├─ processed/                             # verarbeitete Intents
├─ logs/                                  # Protokolle
├─ output/                                # generierte Dateien (DOCX/PDF)
├─ atlas-bridge/                          # ChatGPT / Atlas Bridge
├─ mcp-server/                            # lokaler oder remote MCP-Server
├─ REACT-UI-Dashboards/                   # externe Dashboards
└─ config/                                # Konfiguration
```

---

## Dokument-Hierarchie

1. **MASTER_MD – Companion-System.md**  
   → Single Source of Truth

2. **AUTOMATIONS-ANHANG – Bridge, Intent-Handling, Word-PDF-Acrobat.md**  
   → Umsetzung & Ausführung

3. Weitere MD-Dateien  
   → abgeleitet, erläuternd, nicht führend

---

## Externe Ordner (nur Ein-/Ausgabe)

Folgende Orte sind **keine Systembestandteile**:
- `~/Documents`
- iCloud Drive
- Google Drive
- OneDrive
- Downloads

Sie dürfen ausschließlich für **Import** oder **Export** genutzt werden.

---

## Änderung & Pflege

- Dauerhafte Regeln → MASTER_MD
- Änderungen immer konsistent nachziehen
- Keine stillschweigenden Abweichungen

---

## Zielzustand

Ein Companion-System, das:
- pfadstabil arbeitet
- agentensicher ist
- langfristig wartbar bleibt
- keine impliziten Annahmen enthält

Dieses README dient der **schnellen Orientierung** für Menschen und Agenten.
