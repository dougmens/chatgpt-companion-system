# Companion-System – Gesamtübersicht

## Zweck
Diese Übersicht beschreibt die Grundstruktur des Companion-Systems und verweist auf die detaillierte Systemarchitektur.

## Kernprinzip
Das Companion-System trennt strikt zwischen **Systemwissen** (Regeln/Meta) und **Ergebnisdokumenten** (Outputs).

## Schichtenmodell (Kurzfassung)
1. **Wissens-/Regelschicht**: `companion-system` (Regeln, Rollen, Schemata, Protokolle)
2. **Workflow- und Automatisierungsschicht**: Standardisierte Abläufe und Automationen
3. **I/O- und Ausführungsschicht**: `atlas-bridge` (Ausführung & Datei-I/O)
4. **Ergebnisdokumente**: Fachordner außerhalb von `companion-system`

## Systemarchitektur
Die detaillierte Architektur inkl. Datenfluss, Zuständigkeiten und Grenzen ist beschrieben in:
- `01_Setup_und_Definitionen/Systemarchitektur.md`

## Systemautomatisierung
Die Workflow- und Automatisierungsschicht ist beschrieben in:
- `01_Setup_und_Definitionen/SYSTEM_AUTOMATISIERUNG.md`
