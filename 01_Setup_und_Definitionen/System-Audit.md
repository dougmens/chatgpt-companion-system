# System-Audit – Companion-System

## Status
Kanonisch · verbindlich · systemweit gültig

## Zweck dieses Dokuments
Dieses Dokument definiert den **verbindlichen Audit- und Konsolidierungsprozess**
für das Companion-System. Ziel ist die **Überprüfung von Vollständigkeit,
Konsistenz, Governance-Konformität und Betriebsbereitschaft** nach Setup-Phasen.

Bei Widersprüchen gilt:
1. Companion-System_Gesamtuebersicht.md
2. Systemarchitektur.md
3. Governance.md
4. Dieses Dokument
5. Code

---

## 1. Audit-Zeitpunkte

Ein Audit ist durchzuführen:
- nach Abschluss einer Setup- oder Migrationsphase
- nach wesentlichen Architekturänderungen
- vor Inbetriebnahme neuer Automatisierungen
- bei Anzeichen von Drift oder Inkonsistenz

---

## 2. Audit-Umfang (verbindlich)

### 2.1 Dokumente & Regeln
- Alle kanonischen Markdown-Dateien vorhanden
- Keine leeren oder fragmentarischen Systemdateien
- Widerspruchsfreiheit zwischen Regeln

### 2.2 Rollen & Zuständigkeiten
- Companion.Andreas als führende Rolle definiert
- Fachrollen vollständig beschrieben
- Keine Überschneidungen oder Lücken

### 2.3 Schemata & Mappings
- companion-json-v2 dokumentiert und aktuell
- Ordner- und Dateityp-Mappings konsistent
- Keine Parallelstrukturen

### 2.4 Implementierung
- Code folgt den dokumentierten Regeln
- Keine impliziten Abweichungen
- Launch-/Automationspfade nachvollziehbar

---

## 3. Prüfschritte (Checkliste)

- [ ] Alle Setup-Dokumente vorhanden
- [ ] Alle Rollen-Dokumente vorhanden
- [ ] Alle Schemata vollständig
- [ ] Ablageregeln eingehalten
- [ ] Versionierung konsistent
- [ ] Entscheidungsprotokoll vorhanden
- [ ] Keine offenen Platzhalter

---

## 4. Abweichungen

- Abweichungen werden dokumentiert
- Jede Abweichung erhält:
  - Beschreibung
  - Ursache
  - Korrekturmaßnahme
  - Verantwortlichkeit

---

## 5. Korrekturprozess

- Korrekturen erfolgen zuerst im Markdown
- Danach Anpassung im Code
- Abschließende Prüfung durch Companion.Andreas

---

## 6. Audit-Ergebnis

Das Audit endet mit einer der folgenden Feststellungen:
- **System konsistent und betriebsbereit**
- **System konsistent mit Auflagen**
- **System nicht konsistent – Korrektur erforderlich**

---

## 7. Verantwortung

- Companion.Andreas führt das Audit
- Codex-Agent unterstützt bei technischer Prüfung
- Fachrollen liefern Zuarbeit auf Anforderung

---

## 8. Geltung

Dieses Audit-Dokument gilt:
- systemweit
- rollenübergreifend
- dauerhaft

Änderungen erfolgen ausschließlich gemäß `Governance.md`.
