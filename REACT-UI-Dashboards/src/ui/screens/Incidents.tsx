import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { EvidenceStrength, Incident, IncidentStatus } from '../../model/types';
import { useStore } from '../state/Store';

const statusOptions: IncidentStatus[] = ['neu', 'offen', 'in_klaerung', 'abgeschlossen', 'archiv'];
const strengthOptions: EvidenceStrength[] = ['schwach', 'mittel', 'stark'];

const sanitizeSummary = (value: string) => {
  const lines = value.split('\n');
  return lines.slice(0, 6).join('\n');
};

export const Incidents: React.FC = () => {
  const { state, updateIncident, updateEvidence, archiveIncident } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(state.incidents[0]?.id ?? null);

  const selected = useMemo(
    () => state.incidents.find((item) => item.id === selectedId) ?? state.incidents[0],
    [selectedId, state.incidents],
  );

  const onSelect = (item: Incident) => setSelectedId(item.id);

  const evidenceForIncident = selected
    ? state.evidence.filter((item) => item.incident_id === selected.id)
    : [];

  const summaryLines = selected ? selected.summary.split('\n').length : 0;

  return (
    <div className="screen split">
      <div className="list-panel">
        <h2>Schäden & Beweise</h2>
        <div className="list">
          {state.incidents.map((item) => (
            <button
              key={item.id}
              className={`list-item${item.id === selected?.id ? ' active' : ''}`}
              onClick={() => onSelect(item)}
            >
              <div>
                <strong>{item.title}</strong>
                <span className="muted">{item.status} · {item.evidence_strength}</span>
              </div>
              <span className={`badge badge-${item.status}`}>{item.status}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="detail-panel">
        {selected ? (
          <div className="detail-card">
            <div className="detail-header">
              <div>
                <h2>{selected.title}</h2>
                <p className="muted">Letztes Update: {format(parseISO(selected.last_update_at), 'dd.MM.yyyy HH:mm')}</p>
              </div>
              {selected.status !== 'archiv' && (
                <button className="secondary" onClick={() => archiveIncident(selected.id)}>
                  Archivieren
                </button>
              )}
            </div>

            <div className="form-grid">
              <label>
                Status
                <select
                  value={selected.status}
                  onChange={(event) =>
                    updateIncident(selected.id, { status: event.target.value as IncidentStatus }, 'Status aktualisiert.')
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Beweisstärke
                <select
                  value={selected.evidence_strength}
                  onChange={(event) =>
                    updateIncident(
                      selected.id,
                      { evidence_strength: event.target.value as EvidenceStrength },
                      'Beweisstärke aktualisiert.',
                    )
                  }
                >
                  {strengthOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full">
                Zusammenfassung (max. 6 Zeilen)
                <textarea
                  rows={6}
                  value={selected.summary}
                  onChange={(event) => {
                    const sanitized = sanitizeSummary(event.target.value);
                    updateIncident(selected.id, { summary: sanitized }, 'Zusammenfassung aktualisiert.');
                  }}
                />
                <span className={`helper ${summaryLines > 6 ? 'warning' : ''}`}>
                  {summaryLines}/6 Zeilen
                </span>
              </label>
            </div>

            <section className="panel compact">
              <h3>Beweise</h3>
              <div className="evidence-grid">
                {evidenceForIncident.map((item) => (
                  <div key={item.id} className="evidence-tile">
                    <div>
                      <strong>{item.title}</strong>
                      <span className="muted">{item.type} · {item.source}</span>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={item.is_attachment_ready}
                        onChange={(event) =>
                          updateEvidence(
                            item.id,
                            { is_attachment_ready: event.target.checked },
                            'Beweisstatus aktualisiert.',
                          )
                        }
                      />
                      <span>{item.is_attachment_ready ? 'bereit' : 'nicht bereit'}</span>
                    </label>
                  </div>
                ))}
                {evidenceForIncident.length === 0 && (
                  <p className="muted">Keine Beweise zugeordnet.</p>
                )}
              </div>
            </section>
          </div>
        ) : (
          <p className="muted">Keine Schäden vorhanden.</p>
        )}
      </div>
    </div>
  );
};
