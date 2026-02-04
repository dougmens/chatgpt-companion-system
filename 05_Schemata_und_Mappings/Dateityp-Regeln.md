# Dateityp-Regeln – Companion-System

## Status
Kanonisch · verbindlich · systemweit gültig

## Zweck dieses Dokuments
Dieses Dokument definiert die **verbindlichen Regeln zur Verwendung,
Einordnung und Behandlung von Dateitypen** im Companion-System.
Ziel ist **Klarheit über Zweck, Einsatz und Ablage** je Dateiformat.

Bei Widersprüchen gilt:
1. Companion-System_Gesamtuebersicht.md
2. Systemarchitektur.md
3. Governance.md
4. Dieses Dokument
5. Code

---

## 1. Grundsatz

- Jeder Dateityp hat einen **klar definierten Zweck**
- Dateitypen werden **nicht zweckentfremdet**
- Ablage und Behandlung richten sich nach dem Dateityp

---

## 2. Systemwissen (Markdown)

### .md
- Träger von Regeln, Rollen, Leitfäden und Protokollen
- Bestandteil des Repository `companion-system`
- Versionierung ausschließlich über Git
- Keine Ergebnisdokumente

---

## 3. Ergebnisdokumente

### .docx
- Bearbeitbare Enddokumente (z. B. Schriftsätze)
- Erstellung über DokumentGPT
- Ablage außerhalb des Systemwissens
- Quelle für finale PDFs

### .pdf
- Finale, unveränderliche Dokumente
- Einreichungs- und Archivformat
- Ableitung aus freigegebenen DOCX-Dateien

---

## 4. Daten & Austauschformate

### .json
- Strukturierte Daten (z. B. companion-json-v2)
- Datenaustausch zwischen Systemkomponenten
- Keine manuellen Änderungen ohne Freigabe

### .csv
- Tabellarische Daten
- Import-/Exportzwecke
- Keine dauerhafte Speicherung sensibler Informationen

---

## 5. Medien & Anlagen

### Bilder (.jpg, .png)
- Beweis- und Anlagendateien
- Unverändert aufbewahren
- Metadaten nicht manipulieren

### Audio/Video (.mp3, .wav, .mp4)
- Dokumentation von Vorfällen oder Sitzungen
- Klare Zuordnung zu Projekt/Fall
- Keine Bearbeitung ohne Kennzeichnung

---

## 6. Technische Dateien

### Code-Dateien (.py, .ts, .tsx, .js)
- Bestandteil des Systems
- Ablage ausschließlich im Repository
- Änderungen nur gemäß Governance

### Konfigurationsdateien (.json, .yml, .plist)
- Systemsteuerung
- Änderungen sind protokollpflichtig

---

## 7. Verbotene Praktiken

- Vermischung von Systemwissen und Ergebnissen
- Nutzung falscher Dateitypen aus Bequemlichkeit
- Umbenennung zur „Versionierung“
- Ablegen von Ergebnissen im Repository

---

## 8. Verantwortung

- Companion.Andreas entscheidet über Ausnahmen
- Ablage-Agent überwacht Einhaltung
- DokumentGPT und Codex-Agent setzen Regeln um

---

## 9. Geltung

Diese Dateityp-Regeln gelten:
- systemweit
- rollenübergreifend
- dauerhaft

Änderungen erfolgen ausschließlich gemäß `Governance.md`.
