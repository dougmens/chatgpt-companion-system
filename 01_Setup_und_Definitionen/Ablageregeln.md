# Ablageregeln – Companion-System

## Status
Kanonisch · verbindlich · systemweit gültig

## Zweck dieses Dokuments
Dieses Dokument definiert die **verbindlichen Regeln zur Ablage, Benennung
und Strukturierung** aller Dateien und Artefakte im Companion-System.
Ziel ist **Nachvollziehbarkeit, Wiederauffindbarkeit und Konsistenz**.

Bei Widersprüchen gilt:
1. Companion-System_Gesamtuebersicht.md
2. Systemarchitektur.md
3. Governance.md
4. Dieses Dokument
5. Code

---

## 1. Grundsatz

- Jede Datei hat **genau einen Ort**
- Jede Datei ist **eindeutig benannt**
- Jede Datei ist **einem Projekt zuordenbar**
- Ergebnisse ≠ Systemwissen

---

## 2. Trennung der Ebenen

### 2.1 Systemwissen
- Markdown-Dateien im Repository `companion-system`
- Regeln, Rollen, Schemata, Governance
- **Keine** Ergebnisdokumente

### 2.2 Ergebnisdokumente
- Schriftsätze, Schreiben, PDFs, Anlagen
- Projekt- bzw. fallbezogen
- **Nicht** Teil des Systemwissens

---

## 3. Verzeichnisstruktur (Grundschema)

- `01_Setup_und_Definitionen/` – Systemverfassung & Regeln
- `02_Arbeitsregeln_und_Leitfaeden/` – operative Leitfäden
- `04_Agenten_und_Rollen/` – Rollenbeschreibungen
- `05_Schemata_und_Mappings/` – Daten- & Ablageschemata
- `06_Logs_und_Protokolle/` – Entscheidungs- & Änderungslogs

Abweichungen sind nur mit Freigabe gemäß `Governance.md` zulässig.

---

## 4. Dateibenennung (verbindlich)

### 4.1 Dokumente

Format:
MM-YY Absender – Dokumentart – Inhalt.ext

Beispiel:
01-26 Amtsgericht-Muenchen – Verfuegung – Raeumung.pdf

Regeln:
- Bindestriche verwenden (–)
- Keine Sonderzeichen (Umlaute ausschreiben)
- Keine Versionsnummern im Dateinamen
- Inhalt muss ohne Öffnen erkennbar sein

### 4.2 Systemdateien

- sprechende, eindeutige Namen
- keine Versionsnummern im Dateinamen
- Versionierung erfolgt im Dokumentkopf oder über Git

---

## 5. Versionierung

- Dateien werden **inhaltlich fortgeschrieben**, nicht dupliziert
- Historie erfolgt über:
  - Git (für Systemwissen)
  - Entscheidungs- und Änderungsprotokolle
- Alte Stände werden **nicht** manuell parallel abgelegt

---

## 6. Ablageverantwortung

- Companion.Andreas entscheidet über Ablageort und Struktur
- DokumentGPT / Ablage-Agent setzen die Regeln um
- Fehlablagen gelten als **Systemfehler**, nicht als Einzelfehler

---

## 7. Archivierung

- Abgeschlossene Projekte werden archiviert
- Archivbereiche sind **read-only**
- Keine Löschung ohne explizite Entscheidung

---

## 8. Geltung

Diese Ablageregeln gelten:
- systemweit
- rollenübergreifend
- dauerhaft

Änderungen erfolgen ausschließlich gemäß `Governance.md`.
