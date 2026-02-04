# Ordner-Mapping Meta ↔ Lokal – Companion-System

## Status
Kanonisch · verbindlich · systemweit gültig

## Zweck dieses Dokuments
Dieses Dokument definiert das **verbindliche Mapping zwischen
logischer (Meta-)Struktur und physischen lokalen Ordnern**
im Companion-System.
Ziel ist **Eindeutigkeit, Automatisierbarkeit und Wiederauffindbarkeit**.

Bei Widersprüchen gilt:
1. Companion-System_Gesamtuebersicht.md
2. Systemarchitektur.md
3. Governance.md
4. Dieses Dokument
5. Code

---

## 1. Grundsatz

- Jede logische Ebene hat **einen festen lokalen Ablageort**
- Lokale Ordner spiegeln die **Systemlogik**, nicht umgekehrt
- Abweichungen sind **nicht zulässig**

---

## 2. Meta-Ebenen (logisch)

- Systemwissen
- Projekte / Fälle
- Ergebnisdokumente
- Archive
- Temporäre Eingänge

---

## 3. Lokale Basisverzeichnisse

Systemwissen:
`/Users/andreasschonlein/companion-system/`

Wissenspool & Master-Dokumente:
`/Users/andreasschonlein/Documents/Companion/`

Projektbezogene Ergebnisdokumente:
Projekt- oder fallbezogene Unterordner außerhalb des Repos

Archive:
Projektbezogene Archivordner (read-only)

---

## 4. Mapping-Tabelle (verbindlich)

Meta-Ebene: Systemwissen  
→ Lokal: `/Users/andreasschonlein/companion-system/`

Meta-Ebene: Rollen & Regeln  
→ Lokal: `/Users/andreasschonlein/companion-system/*`

Meta-Ebene: Master-Dokumente (Wissenspool)  
→ Lokal: `/Users/andreasschonlein/Documents/Companion/`

Meta-Ebene: Ergebnisdokumente  
→ Lokal: Projekt-/Fallordner außerhalb des Repos

Meta-Ebene: Archiv  
→ Lokal: Archivordner (read-only)

Meta-Ebene: Temporäre Eingänge (Scanner, Import)  
→ Lokal: definierte Eingangsordner (z. B. Scanner-Inbox)

---

## 5. Automatisierungsrelevanz

- Ablage-Agent nutzt dieses Mapping zur Validierung
- DokumentGPT verwendet Mapping zur korrekten Ausgabe
- Automatisierungen dürfen **keine eigenen Pfade definieren**

---

## 6. Verbotene Praktiken

- Ablage von Ergebnisdokumenten im Repository
- Manuelles Abweichen vom Mapping
- Mehrdeutige Ordnerstrukturen
- Temporäre Dateien ohne Weiterverarbeitung

---

## 7. Verantwortung

- Companion.Andreas entscheidet über Struktur
- Ablage-Agent überwacht Einhaltung
- Codex-Agent setzt Mapping technisch um

---

## 8. Geltung

Dieses Ordner-Mapping gilt:
- systemweit
- rollenübergreifend
- dauerhaft

Änderungen erfolgen ausschließlich gemäß `Governance.md`.
