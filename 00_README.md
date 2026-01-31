# Companion-System – README (Kanon)

## Zweck
Dieses Verzeichnis enthält ausschließlich **Systemwissen** für das Companion-System (Regeln, Definitionen, Rollen, Protokolle).

**Wichtig:** Hier liegen keine Ergebnisdokumente (keine PDFs/DOCX).

## Harte Trennregel
- **Ergebnisdokumente** (`.pdf`, `.docx`, optional `.xlsx/.pptx`) liegen unter:
  `/Users/andreasschonlein/Documents/<Fachordner>/...`
- **System-/Meta-Dateien** (`.md`, `.json`, `.yaml`, `.log`, etc.) liegen ausschließlich unter:
  `/Users/andreasschonlein/companion-system/...`

## Ordner-Navigation
- `01_Setup_und_Definitionen/` → Fundament (Begriffe, Governance, Ablage-Regeln)
- `02_Arbeitsregeln_und_Leitfaeden/` → Alltag (Leitfäden, Checklisten)
- `03_Fallakten_Meta/` → Fallakten-Meta (nur `.md`, keine PDFs)
- `04_Agenten_und_Rollen/` → Zuständigkeiten & Grenzen
- `05_Schemata_und_Mappings/` → Schemata & Mappings (z. B. companion-json-v2)
- `06_Logs_und_Protokolle/` → Protokolle/Logs
- `90_Archiv/` → abgelöste Stände

## Arbeitsmodus (kurz)
- Systemarbeit (Regeln/MD/Struktur) mache ich **nur in der ChatGPT-Webversion**.
- Wenn etwas nicht im Finder existiert, gilt es als **nicht erledigt**.


## Dashboard-Parsing (Kurzformat)
Für die Dashboard-Ansicht werden kurze Auszuege aus den Fallakten gelesen:

- `Aufgaben.md`: Zeilen mit `- [ ]` oder `- [x]`.
  Optional: `P1/P2/P3` oder `prio:hoch|mittel|niedrig`, `label:...` bzw. `[label: ...]`, Tags `#tag`.
- `Notizen.md`: Erste Zeilen (ohne Ueberschriften). Tags `#tag` werden entfernt.
- `Timeline.md`: Bullet-Lines, z. B. `- 2026-01-31: Ereignis`. Optional Tags/Label/Prioritaet wie oben.

Hinweis: Das Parsing ist bewusst einfach und kuerzt automatisch (max. 5 Aufgaben/Timeline, 6 Notizzeilen).

