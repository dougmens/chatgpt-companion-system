# Systemautomatisierung – Companion-System

## Zweck
Diese Datei beschreibt die **Workflow- und Automatisierungsschicht** des Companion-Systems: wie Regeln in wiederholbare Abläufe übersetzt werden, wie Automationen ausgelöst werden und welche Grenzen gelten.

## Einordnung im Schichtenmodell
- **Wissens-/Regelschicht**: definiert Anforderungen, Ablage und Governance.
- **Workflow- und Automatisierungsschicht**: übersetzt Regeln in standardisierte Abläufe.
- **I/O- und Ausführungsschicht (atlas-bridge)**: führt konkrete I/O- und lokale Aktionen aus.
- **Ergebnisdokumente**: werden außerhalb von `companion-system` abgelegt.

## Ziele der Workflow- und Automatisierungsschicht
- **Standardisierung**: Wiederholbare, nachvollziehbare Arbeitsabläufe.
- **Qualität**: Konsistente Ergebnisse durch Checklisten, Validierungen und Templates.
- **Effizienz**: Reduktion manueller Schritte durch Automationsbausteine.
- **Transparenz**: Jeder Ablauf ist beschreibbar und auditierbar.

## Bausteine
- **Workflows**
  - Strukturierte Schrittfolgen für typische Aufgaben.
  - Verweisen auf Leitfäden, Templates und Schemata.
- **Automationen**
  - Auslösergesteuerte Aktionen (z. B. Datei-Validierung, Umbenennung, Ablageprüfung).
  - Müssen durch Regeln der Wissensschicht legitimiert sein.
- **Checklisten & Gateways**
  - Prüfschritte vor kritischen Aktionen (z. B. Ausgabe/Export).
- **Templates**
  - Standardisierte Ausgangsstrukturen für konsistente Ergebnisse.

## Auslöser (Trigger)
- **Manuell**: explizite Anweisung durch den Nutzer.
- **Regelbasiert**: aus der Wissensschicht abgeleitete Triggerbedingungen.
- **Zustandsbasiert**: wenn definierte Zustände/Metadaten vorliegen.

## Ablaufprinzip (vereinfacht)
```
Regel/Leitfaden
      |
      v
Workflow-Definition
      |
      v
Automations-Trigger
      |
      v
atlas-bridge (I/O + Ausführung)
      |
      v
Ergebnisdokumente (Fachordner)
```

## Zuständigkeiten & Grenzen
- **Workflow-Schicht entscheidet nicht über Inhalte**; sie setzt nur Regeln um.
- **Automationen dürfen keine Regeln umgehen** und keine Ergebnisdokumente im Systemwissen erzeugen.
- **Keine Selbstermächtigung**: neue Automationen erfordern explizite Regelbasis.

## Qualitäts- und Sicherheitsprinzipien
- **Nachvollziehbarkeit**: jeder Automationsschritt ist dokumentierbar.
- **Minimaler Eingriff**: Automationen greifen nur so weit wie nötig ein.
- **Trennung wahren**: Systemwissen bleibt in `companion-system`, Ergebnisse bleiben außerhalb.

## Geltungsbereich
Diese Beschreibung gilt für alle Agenten, Workflows und Automationen im Companion-System.
