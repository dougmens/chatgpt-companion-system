# Systemarchitektur – Companion-System

## Status
Kanonisch · beschreibend · verbindlich

## Zweck dieses Dokuments
Dieses Dokument beschreibt die **tatsächlich umgesetzte Systemarchitektur**
des Companion-Systems. Es dient als technische Referenz und
verbindlicher Orientierungsrahmen für Implementierung, Betrieb und Wartung.

Neue Architekturentscheidungen werden hier **nicht** getroffen.

---

## 1. Architekturprinzip

Das Companion-System folgt einer **mehrschichtigen, strikt getrennten Architektur**:

- Denken & Entscheiden
- Strukturierte Steuerung
- Technische Ausführung
- Visuelle Darstellung

Jede Schicht hat **klar definierte Aufgaben** und **ersetzt keine andere**.

---

## 2. Schichtenmodell (Übersicht)

### 2.1 Chat-Ebene
**Funktion:** Analyse, Strukturierung, Entscheidungsfindung

- Interaktion mit Companion.Andreas
- Aktivierung von Fachrollen
- Erzeugung strukturierter Intents
- Keine UI-Simulation
- Keine Persistenz

---

### 2.2 Intent-Ebene
**Funktion:** Strukturierte Steuerung

- Format: `companion-json-v2`
- Intents sind explizit und maschinenlesbar
- Reihenfolge ist verbindlich

Zulässige Kern-Intents:
- UPDATE_DASHBOARD_DATA
- SHOW_DASHBOARD
- FOCUS_ENTITY
- PLAN_WORKFLOW

---

### 2.3 Bridge-Ebene (Atlas-Bridge)
**Funktion:** Technische Vermittlungs- und Ausführungsschicht

- Lokaler MCP-Server (Python)
- HTTP-Endpunkte (z. B. `/health`, `/dashboard-data`)
- Validierung und Routing von Intents
- Bereitstellung von Dashboard-Daten
- Watchdog- und Health-Check-Integration (launchd)

Die Bridge trifft **keine fachlichen Entscheidungen**.

---

### 2.4 Dashboard-Ebene
**Funktion:** Visualisierung & Navigation

- Externe React-Anwendungen (Vite)
- Rein lesende Darstellung des Systemzustands
- Navigation zwischen Fällen, Fristen, Aufgaben
- Kein Business-Logic-Ersatz
- Kein Schreiben von Systemregeln

Dashboards sind **austauschbar**, solange sie die Datenverträge einhalten.

---

### 2.5 Tool- & Dateisystem-Ebene
**Funktion:** Konkrete Ausführung

- Lokale Skripte
- Dateisystem
- Word / PDF / Acrobat
- Betriebssystem-Mechanismen (launchd)

Diese Ebene führt aus, **entscheidet aber nicht**.

---

## 3. Datenfluss (vereinfachtes Modell)

1. Nutzer interagiert im Chat
2. Companion.Andreas erzeugt Intents
3. Intents werden an die Atlas-Bridge übergeben
4. Bridge:
   - validiert
   - verarbeitet
   - liefert strukturierte Daten
5. Dashboards visualisieren den Zustand
6. Tools setzen Aktionen um (falls vorgesehen)

---

## 4. Betriebsarchitektur (lokal)

- Companion-System läuft primär **lokal**
- Atlas-Bridge wird über `launchd` gestartet
- Health-Check prüft Erreichbarkeit
- Frontends werden bei Bedarf manuell gestartet
- Kein Cloud-Zwang

---

## 5. Abgrenzungen & Verantwortlichkeiten

- Chat:
  - denkt
  - entscheidet
- Bridge:
  - vermittelt
  - führt aus
- Dashboard:
  - zeigt an
- Tools:
  - arbeiten

Verletzungen dieser Abgrenzung gelten als **Architekturfehler**.

---

## 6. Erweiterbarkeit

Neue Komponenten dürfen nur ergänzt werden, wenn sie:
- sich eindeutig einer Schicht zuordnen lassen
- bestehende Rollen nicht ersetzen
- die Governance-Regeln einhalten

---

## 7. Geltung

Dieses Dokument gilt:
- systemweit
- rollenübergreifend
- solange, bis es bewusst geändert wird

Änderungen erfolgen ausschließlich gemäß `Governance.md`.
