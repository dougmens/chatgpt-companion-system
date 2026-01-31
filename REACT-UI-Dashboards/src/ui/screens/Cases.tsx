import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CaseItem, CaseStatus, RiskLevel } from '../../model/types';
import { useStore } from '../state/Store';
import { deriveCaseState } from '../../model/derive';

const statusOptions: CaseStatus[] = [
  'neu',
  'aktiv',
  'wartet',
  'pruefen',
  'finalisieren',
  'erledigt',
  'archiv',
];

const riskOptions: RiskLevel[] = ['niedrig', 'mittel', 'hoch'];

const priorityLabel = {
  hoch: 'P1',
  mittel: 'P2',
  niedrig: 'P3',
} as const;

const sanitizeNextAction = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences[0] ?? trimmed;
};

const countSentences = (value: string) =>
  value.trim().split(/(?<=[.!?])\s+/).filter(Boolean).length;

export const Cases: React.FC = () => {
  const { state, updateCase, archiveCase } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(state.cases[0]?.id ?? null);

  const selected = useMemo(
    () => state.cases.find((item) => item.id === selectedId) ?? state.cases[0],
    [selectedId, state.cases],
  );

  const onSelect = (item: CaseItem) => setSelectedId(item.id);

  const nextActionSentences = selected ? countSentences(selected.next_action) : 0;

  return (
    <div className="screen split">
      <div className="list-panel">
        <h2>Rechtsfälle</h2>
        <div className="list">
          {state.cases.map((item) => (
            <button
              key={item.id}
              className={`list-item${item.id === selected?.id ? ' active' : ''}`}
              onClick={() => onSelect(item)}
            >
              <div>
                <strong>{item.title}</strong>
                <span className="muted">{item.category} · {item.status}</span>
              </div>
              <span className={`badge badge-${deriveCaseState(item)}`}>{deriveCaseState(item)}</span>
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
                <button className="secondary" onClick={() => archiveCase(selected.id)}>
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
                    updateCase(selected.id, { status: event.target.value as CaseStatus }, 'Status aktualisiert.')
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
                Risiko
                <select
                  value={selected.risk_level}
                  onChange={(event) =>
                    updateCase(selected.id, { risk_level: event.target.value as RiskLevel }, 'Risiko aktualisiert.')
                  }
                >
                  {riskOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Frist (optional)
                <input
                  type="date"
                  value={selected.deadline_date ?? ''}
                  onChange={(event) =>
                    updateCase(selected.id, {
                      deadline_date: event.target.value ? event.target.value : undefined,
                    }, 'Frist aktualisiert.')
                  }
                />
              </label>
              <label className="full">
                Next Action (genau ein Satz)
                <input
                  type="text"
                  value={selected.next_action}
                  onChange={(event) => {
                    const sanitized = sanitizeNextAction(event.target.value);
                    updateCase(selected.id, { next_action: sanitized }, 'Next Action angepasst.');
                  }}
                  placeholder="Ein klarer nächster Schritt."
                />
                {nextActionSentences > 1 && (
                  <span className="helper warning">Bitte genau einen Satz eingeben.</span>
                )}
                {nextActionSentences <= 1 && (
                  <span className="helper">Ein Satz reicht vollkommen.</span>
                )}
              </label>
            </div>

            <div className="meta-grid">
              <div>
                <span className="muted">Domain</span>
                <strong>{selected.domain}</strong>
              </div>
              <div>
                <span className="muted">Kategorie</span>
                <strong>{selected.category}</strong>
              </div>
              <div>
                <span className="muted">Owner</span>
                <strong>{selected.owner}</strong>
              </div>
              <div>
                <span className="muted">Aktenzeichen</span>
                <strong>{selected.file_reference ?? '-'}</strong>
              </div>
              <div>
                <span className="muted">Gegenseite</span>
                <strong>{selected.counterparty ?? '-'}</strong>
              </div>
              <div>
                <span className="muted">Gericht</span>
                <strong>{selected.court ?? '-'}</strong>
              </div>
            </div>

            <div className="detail-columns">
              <section className="panel compact">
                <h3>Aufgaben (Auszug)</h3>
                {selected.tasks && selected.tasks.length > 0 ? (
                  <ul className="mini-list">
                    {selected.tasks.map((task, index) => (
                      <li
                        key={`${selected.id}-task-${index}`}
                        className={`mini-item ${task.done ? 'task-done' : ''}`}
                      >
                        <span className="muted">{task.done ? '✓' : '•'}</span>
                        <div className="mini-content">
                          <span>{task.text}</span>
                          {(task.priority || task.label || (task.tags && task.tags.length > 0)) && (
                            <div className="chip-row">
                              {task.priority && (
                                <span className={`chip chip-priority-${task.priority}`}>
                                  {priorityLabel[task.priority]}
                                </span>
                              )}
                              {task.label && <span className="chip chip-label">{task.label}</span>}
                              {task.tags?.map((tag) => (
                                <span key={tag} className="chip chip-tag">#{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">Keine Aufgaben gefunden.</p>
                )}
              </section>
              <section className="panel compact">
                <h3>Notizen (Auszug)</h3>
                {selected.notes_excerpt && selected.notes_excerpt.length > 0 ? (
                  <ul className="mini-list">
                    {selected.notes_excerpt.map((line, index) => (
                      <li key={`${selected.id}-note-${index}`} className="mini-item">
                        <span className="muted">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">Keine Notizen.</p>
                )}
              </section>
            </div>

            <section className="panel compact">
              <h3>Timeline (Auszug)</h3>
              {selected.timeline && selected.timeline.length > 0 ? (
                <ul className="timeline-list">
                  {selected.timeline.map((item, index) => (
                    <li key={`${selected.id}-time-${index}`}>
                      <span className="muted">{item.date ?? '—'}</span>
                      <div className="mini-content">
                        <span>{item.text || 'Eintrag'}</span>
                        {item.tags && item.tags.length > 0 && (
                          <div className="chip-row">
                            {item.tags.map((tag) => (
                              <span key={tag} className="chip chip-tag">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">Keine Timeline-Einträge.</p>
              )}
            </section>
          </div>
        ) : (
          <p className="muted">Keine Fälle vorhanden.</p>
        )}
      </div>
    </div>
  );
};
