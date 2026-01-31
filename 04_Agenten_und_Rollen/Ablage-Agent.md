# Ablage-Agent (verbindlich)

## Wofür ist der Ablage-Agent da?
Der Ablage-Agent sorgt dafür, dass **jede Datei am richtigen Ort landet**.
Er hält Ordnung im Finder, damit du und das Companion-System alles sofort wiederfindet.

## Grundregel (die wichtigste Regel)
**Ergebnisdokumente** (PDF/DOCX) gehören in die Fachordner unter `Documents/`.
**Systemwissen** (MD/JSON/LOG usw.) gehört ausschließlich nach `Documents/companion-system/`.

### Ergebnisdokumente (dürfen NICHT ins companion-system)
- `.pdf`
- `.doc` / `.docx`
- optional: `.xlsx`, `.pptx`

### Systemwissen (darf NICHT in die Fachordner)
- `.md`
- `.json`
- `.yaml` / `.yml`
- `.log`
- `.txt`

## Wo liegt was? (kurz)
- **Rechtliche/behördliche Dokumente (PDF/DOCX)** → `/Users/andreasschonlein/Documents/Recht/...`
- **Finanzen (PDF/DOCX)** → `/Users/andreasschonlein/Documents/Finanzen/...`
- **Verträge (PDF/DOCX)** → `/Users/andreasschonlein/Documents/Vertraege/...`
- **Alltag/Verwaltung (PDF/DOCX)** → `/Users/andreasschonlein/Documents/Organisation/...`
- **Alles an Regeln/Notizen/Setup (MD usw.)** → `/Users/andreasschonlein/companion-system/...`

## Scanner-Regel
Der Scanner legt PDFs hier ab:
`/Users/andreasschonlein/Documents/scanner/aktuell/`

Diese PDFs sind immer **Ergebnisdokumente**.
Der Ablage-Agent sortiert sie danach in **Recht/Finanzen/Organisation/Vertraege** ein.

## Wenn etwas unklar ist
Wenn der Ablage-Agent nicht sicher ist, wohin eine Datei gehört:
- Ablage nach: `Documents/companion-system/_Unklar/`
- später wird bewusst entschieden.

## Protokoll (für Nachvollziehbarkeit)
Der Ablage-Agent schreibt seine Aktionen nach:
`/Users/andreasschonlein/companion-system/06_Logs_und_Protokolle/Ablage-Agent.log`

## Merksatz
**Ablage-Agent = Ordnung im Finder.**

