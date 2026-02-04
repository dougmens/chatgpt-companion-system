# Versionierung – Companion-System

## Status
Kanonisch · verbindlich · systemweit gültig

## Zweck dieses Dokuments
Dieses Dokument definiert die **verbindlichen Regeln zur Versionierung**
von Systemwissen, Dokumenten und Artefakten im Companion-System.
Ziel ist **Nachvollziehbarkeit, Reproduzierbarkeit und Kontrollierbarkeit**
ohne Parallelstrukturen oder Drift.

Bei Widersprüchen gilt:
1. Companion-System_Gesamtuebersicht.md
2. Systemarchitektur.md
3. Governance.md
4. Dieses Dokument
5. Code

---

## 1. Grundsatz

- Versionierung dient der **Nachvollziehbarkeit**, nicht der Vervielfältigung
- Es gibt **keine parallelen Versionen** derselben Datei im aktiven Bestand
- Historie ist **technisch oder dokumentarisch**, nicht dateibasiert

---

## 2. Geltungsbereiche

### 2.1 Systemwissen
- Markdown-Dateien im Repository `companion-system`
- Rollen, Regeln, Schemata, Governance

### 2.2 Ergebnisdokumente
- Schriftsätze, Schreiben, PDFs, Anlagen
- Projekt- bzw. fallbezogene Dokumente

---

## 3. Versionierung von Systemwissen

- Systemwissen wird **ausschließlich über Git** versioniert
- Es gibt **keine Versionsnummern im Dateinamen**
- Änderungen erfolgen durch **Überschreiben der Datei**
- Historie ist jederzeit über Git nachvollziehbar

Zusätzliche Regeln:
- Commit-Nachrichten müssen den Änderungszweck klar benennen
- Struktur- oder Regeländerungen sind im Entscheidungsprotokoll zu vermerken

---

## 4. Versionierung von Ergebnisdokumenten

- Ergebnisdokumente tragen **keine Versionsnummern im Dateinamen**
- Aktualisierungen überschreiben die bestehende Datei
- Frühere Stände werden:
  - im Verfahrensverlauf dokumentiert oder
  - durch externe Systeme (z. B. beA/eBO, E-Mail) nachvollziehbar

Bei Bedarf kann ein früherer Stand explizit archiviert werden.

---

## 5. Entscheidungs- und Änderungsprotokolle

- Grundsatzänderungen werden im Entscheidungsprotokoll dokumentiert
- Protokolle enthalten:
  - Datum
  - betroffene Datei(en)
  - Art der Änderung
  - kurze Begründung
- Protokolle ersetzen **keine** Versionsdateien

---

## 6. Umgang mit Fehlern

- Fehler werden **korrigiert**, nicht versioniert
- Es gibt keine „Bugfix-Versionen“ im Dateinamen
- Die Korrektur wird dokumentiert, falls sie relevant ist

---

## 7. Archivierung

- Archivierte Inhalte gelten als **abgeschlossen**
- Archivierte Inhalte werden **nicht** weiter versioniert
- Änderungen im Archiv sind unzulässig

---

## 8. Verantwortlichkeit

- Companion.Andreas entscheidet über:
  - Art und Umfang von Änderungen
  - Archivierung
- DokumentGPT setzt Versionierungsregeln bei Dokumenten um
- Codex-Agent setzt Versionierungsregeln bei Systemwissen um

---

## 9. Geltung

Diese Versionierungsregeln gelten:
- systemweit
- rollenübergreifend
- dauerhaft

Änderungen erfolgen ausschließlich gemäß `Governance.md`.
