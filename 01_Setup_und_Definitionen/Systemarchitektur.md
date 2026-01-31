# Systemarchitektur – Companion-System

## Zweck
Diese Datei beschreibt die Systemarchitektur des Companion-Systems mit Fokus auf **atlas-bridge** als I/O- und Ausführungsschicht.

## Architektur-Überblick (Schichten)
1. **Wissens-/Regelschicht** (companion-system)
   - Enthält Regeln, Definitionen, Rollen, Schemata und Protokolle.
   - Ist die normative Quelle für Struktur und Verhalten.
2. **I/O- und Ausführungsschicht** (atlas-bridge)
   - Vermittelt Ein- und Ausgaben sowie die Ausführung lokaler Operationen.
   - Stellt die technische Brücke zwischen Systemwissen und realen Artefakten her.
3. **Ergebnis-/Fachdokumente** (Fachordner außerhalb von companion-system)
   - Enthält Outputs wie `.pdf`, `.docx`, optional `.xlsx/.pptx`.

## Rolle von atlas-bridge
**atlas-bridge** ist die **I/O- und Ausführungsschicht** des Companion-Systems.

Kernaufgaben:
- **I/O-Orchestrierung**: Einlesen/Schreiben von Dateien außerhalb des Systemwissens.
- **Ausführung**: Kontrollierte Ausführung von lokalen Operationen (z. B. Shell-Commands), sofern durch Regeln erlaubt.
- **Brücke**: Übersetzt Systemregeln in konkrete Arbeitsaktionen und Dateizugriffe.

Nicht-Aufgaben:
- Kein Ort für Systemwissen (keine Regeln/Definitionen im atlas-bridge-Verzeichnis).
- Kein Ort für Ergebnisdokumente, außer technischer Zwischenschritte.

## Daten- und Kontrollfluss (vereinfacht)
```
[companion-system]
  Regeln/Schemata/Rollen
          |
          v
     [atlas-bridge]
  I/O + Ausführung
          |
          v
[Ergebnisdokumente]
  (Fachordner)
```

## Schnittstellen
- **Nach innen (companion-system)**
  - Nimmt Vorgaben aus Regeln, Schemata und Arbeitsleitfäden auf.
  - Verändert Systemwissen nicht ohne explizite Anweisung.
- **Nach außen (Fachordner)**
  - Schreibt/liest Ergebnisdokumente gemäß Ablageregeln.
  - Hält die Trennregel zwischen Systemwissen und Ergebnissen ein.

## Zuständigkeiten & Grenzen
- **companion-system**: Normative Quelle; legt fest *was* und *wie* gearbeitet wird.
- **atlas-bridge**: Führt aus; entscheidet nicht selbstständig über Inhalte oder Ablageorte.
- **Fachordner**: Zielorte für Ergebnisse; keine Systemregeln.

## Betriebsprinzipien
- **Nachvollziehbarkeit**: Aktionen über atlas-bridge müssen nachvollziehbar sein.
- **Minimaler Eingriff**: Nur notwendige I/O- und Ausführungsschritte durchführen.
- **Trennung wahren**: Keine Ergebnisdokumente im Systemwissen, keine Regeln in Fachordnern.

## Geltungsbereich
Diese Architektur gilt für alle Arbeitsmodi und Agenten, die mit dem Companion-System interagieren.
