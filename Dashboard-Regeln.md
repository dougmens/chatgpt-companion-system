# Dashboard-Regeln – Companion-System (Root-sicher)

## Zweck
Dieses Dokument regelt **verbindlich**, wie Dashboards im Companion-System
aufgebaut, gelesen und gepflegt werden.

Dashboards sind **Visualisierung**, nicht Logik, nicht Persistenz.

---

## System-Root (verbindlich)

Alle Dashboards beziehen ihre Daten **ausschließlich** aus dem System-Root:

```
/Users/andreasschonlein/companion-system/
```

Insbesondere aus:
- `/data/`
- **niemals** aus `~/Documents` oder Cloud-Ordnern

---

## Grundprinzipien

1. **Dashboard = Read-only**
2. **Persistenz erfolgt ausschließlich über Automationen**
3. **Fristen & Risiken schlagen Ordnung**
4. **Archiv ist Status, kein Ordner**

---

## Wann ein Dashboard verpflichtend ist

Ein Dashboard **muss** existieren, wenn mindestens eines zutrifft:
- laufender Rechtsfall
- finanzielle oder rechtliche Risiken
- mehrstufige Prozesse
- Fristen oder Termine

---

## Standard-Dashboard-Struktur (verbindlich)

| Feld | Bedeutung |
|-----|----------|
| Projekt | Stabiler Projektname |
| Unterthema | Aktueller Fokus |
| Status | Arbeitsstand |
| Next Action | **Genau eine** nächste Handlung |
| Frist | Datum (falls vorhanden) |
| Letzte Änderung | Zeitstempel |

---

## Statuslogik (verbindlich)

Zulässige Status:
- neu
- aktiv
- wartet
- pruefen
- finalisieren
- erledigt
- archiv

Keine Abweichungen.

---

## To-do- / Action-Regeln

- Pro Vorgang **eine** Next Action
- Keine Sammel-Tasks
- Erledigt = Statuswechsel, nicht Löschen

---

## Aktualisierung

- Dashboards werden **automatisch** aktualisiert
- Manuelle Änderungen sind unzulässig
- Quelle der Wahrheit: `/data/*` + Events

---

## Archivierungslogik

- Archiv = `status = archiv`
- Auto-Archivierung über `last_update_at`
- Archivierte Einträge bleiben sichtbar

---

## Rollen & Verantwortung

- **Companion.Andreas**
  - entscheidet über Dashboard-Pflicht
  - priorisiert Inhalte

- Fachrollen
  - liefern Daten
  - ändern keine Status ohne Freigabe

---

## Verbotene Muster

- Dashboard als Dateispeicher
- Dashboard als Notizzettel
- direkte Dateipfade auf `Documents`
- Logik im UI

---

## Zielzustand

Dashboards sollen:
- Klarheit schaffen
- Risiken sichtbar machen
- Entscheidungen unterstützen
- **niemals** selbst entscheiden
