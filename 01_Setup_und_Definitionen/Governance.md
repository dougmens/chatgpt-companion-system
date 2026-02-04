# Governance – Companion-System

## Status
Kanonisch · verbindlich · systemweit gültig

## Zweck dieses Dokuments
Dieses Dokument regelt **Änderungen, Freigaben, Versionierung und Konsistenz**
im Companion-System. Es verhindert Architektur-Drift, Regel-Duplikate
und unkontrollierte Erweiterungen.

Bei Widersprüchen gilt:
1. Companion-System_Gesamtuebersicht.md
2. Systemarchitektur.md
3. Dieses Dokument
4. Code

---

## 1. Grundsatz

Das Companion-System ist ein **regelbasiertes, dauerhaftes System**.
Änderungen erfolgen **bewusst, dokumentiert und freigegeben**.

Spontane oder implizite Änderungen sind unzulässig.

---

## 2. Single Source of Truth

### 2.1 Geltende Wissensebene
- **Markdown-Dateien im Repository `companion-system`** sind verbindlich.
- Chats sind **Arbeitsräume**, keine Wissensspeicher.
- Externe Dokumente dienen nur als Referenz oder Archiv.

### 2.2 Konsequenz
Was nicht als `.md` im Repository definiert ist, gilt als **nicht freigegeben** –
auch wenn es technisch implementiert wurde.

---

## 3. Rollen & Zuständigkeiten (Governance-Sicht)

### 3.1 Owner
**Andreas Schönlein**
- fachliche Letztentscheidung
- Freigabe von Grundsatzänderungen

### 3.2 Orchestrator
**Companion.Andreas**
- Einhaltung der Systemregeln
- Konsistenzprüfungen
- Priorisierung bei Konflikten
- Steuerung von Fachrollen und Codex

### 3.3 Implementierer
**Codex-Agent**
- setzt ausschließlich freigegebene MDs um
- trifft keine Architektur- oder Governance-Entscheidungen
- dokumentiert IST-Zustände auf Anforderung

---

## 4. Änderungsarten

### 4.1 Redaktionelle Änderungen
- Klarstellungen
- Strukturverbesserungen
- Tippfehler

→ Keine neue Freigabe nötig, aber Dokumentation.

### 4.2 Funktionale Änderungen
- neue Rollen
- neue Intents
- neue Datenfelder
- neue Automationen

→ **Freigabepflichtig**.

### 4.3 Strukturänderungen
- neue Schichten
- geänderte Verantwortlichkeiten
- neue Kernkomponenten

→ **Explizite Entscheidung + Dokumentation erforderlich**.

---

## 5. Änderungsprozess (verbindlich)

1. Änderungsbedarf identifizieren
2. Betroffenes MD benennen
3. Änderung im MD ausarbeiten
4. Konsistenz prüfen (gegen andere MDs)
5. Freigabe durch Owner
6. Version erhöhen (falls relevant)
7. Umsetzung im Code (falls nötig)

Kein Schritt darf übersprungen werden.

---

## 6. Versionierung

- Versionierung erfolgt **dateibezogen**
- Format: `vMAJOR.MINOR`
- MAJOR: grundlegende Änderung
- MINOR: Erweiterung oder Präzisierung

Versionen werden im Dokumentkopf gepflegt.

---

## 7. Konsistenz-Check (verpflichtend)

Bei jeder relevanten Änderung ist zu prüfen:
- Überschneidung mit bestehenden Regeln
- Widersprüche zu höherwertigen Dokumenten
- Auswirkungen auf Rollen oder Intents

Ungeprüfte Änderungen gelten als **nicht gültig**.

---

## 8. Umgang mit Abweichungen

- Technische Abweichungen werden dokumentiert
- Sie gelten nicht als neue Regel
- Rückführung oder Anpassung wird entschieden

---

## 9. Geltung

Dieses Dokument gilt:
- systemweit
- rollenübergreifend
- dauerhaft

Änderungen erfolgen ausschließlich gemäß diesem Dokument.
