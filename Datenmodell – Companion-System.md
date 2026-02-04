# Datenmodell – Companion-System (verbindlich, Root-basiert)

## Ziel
Ein **stabiles, pfadsauberes** Datenmodell für Dashboards und Automationen.
Dieses Modell ist **Root-relativ** und kompatibel mit `companion-json-v2`.

---

## Grundsatz: Pfade & Persistenz (VERBINDLICH)

- **System-Root:** `/Users/andreasschonlein/companion-system/`
- Alle Dateiverweise sind **Root-relativ**
- **Keine** absoluten Pfade außerhalb des Roots
- Externe Dateien werden **importiert** oder **referenziert**, aber nicht dort bearbeitet

---

## Designprinzipien
- Single Next Action pro Vorgang
- Echte Fristen ≠ Wiedervorlagen
- Beweise sind **explizit anlagefähig**
- Archiv ist **Status**, kein separater Speicherort

---

## Entity: Case (Rechtsfall / Vorgang)

### Pflichtfelder (MVP)
- `id` (UUID)
- `title`
- `domain` – `recht | organisation | finanzen | projekt`
- `category`
- `status` – `neu | aktiv | wartet | pruefen | finalisieren | erledigt | archiv`
- `risk_level` – `niedrig | mittel | hoch`
- `next_action` – **ein Satz**
- `deadline_date` (optional)
- `deadline_type` (optional)
- `last_update_at` (ISO-8601)
- `owner` (Standard: Andreas)
- `tags` (optional)

### Zusatzfelder (Recht)
- `court`
- `file_reference`
- `counterparty`
- `lawyer`
- `next_hearing_date` (optional)

---

## Entity: Incident (Vorfall / Schaden)

### Pflichtfelder
- `id`
- `title`
- `incident_date`
- `status` – `neu | offen | in_klaerung | abgeschlossen | archiv`
- `evidence_strength` – `schwach | mittel | stark`
- `summary`
- `last_update_at`

### Zusatzfelder
- `location`
- `estimated_damage_eur`
- `intent_suspected` (bool)
- `witnesses`

---

## Entity: EvidenceItem (Anlage / Beweis)

### Pflichtfelder
- `id`
- `title`
- `type` – `foto | pdf | mail | chat | rechnung | sonstiges`
- `source` – `scan | kamera | gmail | whatsapp | notiz | download | sonstiges`
- `file_path` – **Root-relativ**, z. B.:
  ```
  data/recht/evidence/E-2026-001.pdf
  ```
- `case_id` (optional)
- `incident_id` (optional)
- `is_attachment_ready` (bool)
- `label` (optional, z. B. „K1“)

**Regel:** `file_path` darf **nie** auf `~/Documents` oder Cloud zeigen.

---

## Entity: Deadline (optional)

- `id`
- `case_id`
- `kind` – `frist | termin | wiedervorlage`
- `date`
- `description`
- `criticality` – `niedrig | mittel | hoch`
- `done` (bool)

---

## Entity: ActionLog (Timeline)

- `id`
- `entity_type` – `case | incident`
- `entity_id`
- `at` (ISO-8601)
- `text`
- `author`

---

## Beziehungen
- Case 1—N EvidenceItem
- Incident 1—N EvidenceItem
- Case 1—N Incident (optional)
- Case 1—N Deadline (optional)
- Case/Incident 1—N ActionLog

---

## Ableitungslogik (Dashboard)

### Kritisch
- Frist ≤ 7 Tage **und** Status ∈ {neu, aktiv, pruefen, finalisieren}
- **oder** `risk_level = hoch`

### Wartet
- `status = wartet`

---

## KPI-Ableitung
- Aktive Fälle
- Kritische Fälle
- Offene Fristen (14 Tage)
- Neue Vorfälle
- Unzugeordnete Beweise

---

## Archivierungsregel
- Archiv = `status = archiv`
- `last_update_at` steuert Auto-Archivierung

---

## Zielzustand
Ein Datenmodell, das:
- pfadstabil ist
- agentensicher ist
- ohne implizite Annahmen auskommt
