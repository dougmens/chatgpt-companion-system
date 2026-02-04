# Fehlervermeidung – Companion-System

## Status
Kanonisch · verbindlich · systemweit gültig

## Zweck dieses Dokuments
Dieses Dokument definiert **typische Fehlerquellen**
bei der Arbeit mit dem Companion-System und legt
**verbindliche Gegenmaßnahmen** fest.
Ziel ist die **Vermeidung von Drift, Inkonsistenzen
und Systembrüchen**.

Bei Widersprüchen gilt:
1. Companion-System_Gesamtuebersicht.md
2. Systemarchitektur.md
3. Governance.md
4. Dieses Dokument
5. Code

---

## 1. Grundsatz

- Fehler entstehen meist durch **Regelabweichungen**
- Technische Fehler sind oft **Governance-Fehler**
- Prävention ist wichtiger als Korrektur

---

## 2. Typische Fehlerquellen

### 2.1 Unklare Zuständigkeiten
- fehlende Rollenaktivierung
- parallele Entscheidungswege
- implizite Verantwortlichkeiten

**Gegenmaßnahme:**  
Rollen immer explizit benennen, Companion.Andreas führt.

---

### 2.2 Vermischung von Ebenen
- UI-Logik im Chat
- Entscheidungen im Dashboard
- Systemregeln im Code

**Gegenmaßnahme:**  
Strikte Ebenentrennung gemäß Systemarchitektur.

---

### 2.3 Parallelstrukturen
- doppelte Regeldateien
- ähnliche Dokumente an verschiedenen Orten
- inkonsistente Benennungen

**Gegenmaßnahme:**  
Single Source of Truth, regelmäßiger Konsistenz-Check.

---

### 2.4 Unsaubere Übergaben
- fehlende Prompt-Struktur
- halbe Inhalte
- nicht reproduzierbare Schritte

**Gegenmaßnahme:**  
Immer klar definierte Übergaben (Prompt + Datei-Inhalt).

---

### 2.5 Spontane Änderungen
- „Quick Fixes“
- Änderungen ohne Dokumentation
- Überspringen von Freigaben

**Gegenmaßnahme:**  
Änderungsprozess strikt einhalten.

---

## 3. Technische Fehler

- falsche Dateipfade
- inkorrekte Dateinamen
- Syntaxfehler durch Fragmentierung

**Gegenmaßnahme:**  
Arbeiten mit vollständigen, einheitlichen Code-Canvases.

---

## 4. Erkennungsmerkmale für Systemfehler

- widersprüchliche Aussagen
- Unsicherheit über den aktuellen Stand
- mehrfaches Nachfragen zu Regeln
- nicht reproduzierbare Ergebnisse

Diese Signale sind ernst zu nehmen.

---

## 5. Korrekturprinzip

- Fehler werden **angehalten**
- Ursache wird identifiziert
- Regel oder Dokument wird angepasst
- Änderung wird protokolliert

---

## 6. Verantwortung

- Companion.Andreas überwacht Fehlervermeidung
- Codex-Agent setzt Korrekturen nur auf Anweisung um
- Fachrollen melden Auffälligkeiten

---

## 7. Geltung

Diese Regeln zur Fehlervermeidung gelten:
- systemweit
- rollenübergreifend
- dauerhaft

Änderungen erfolgen ausschließlich gemäß `Governance.md`.
