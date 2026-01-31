import React, { useMemo, useState } from 'react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { useStore } from '../state/Store';
import { kpis, deadlineStatus } from '../../model/derive';
import type { DeadlineItem } from '../../model/types';
import { InsightsPanel } from '../components/InsightsPanel';

export const Master: React.FC = () => {
  const { state } = useStore();
  const metrics = kpis(state.cases, state.incidents, state.evidence, state.deadlines);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'due3' | 'due10'>('all');
  const [selected, setSelected] = useState<DeadlineItem | null>(null);

  const priorityLabel = {
    hoch: 'P1',
    mittel: 'P2',
    niedrig: 'P3',
  } as const;

  const priorityRank = {
    hoch: 1,
    mittel: 2,
    niedrig: 3,
  } as const;


  const tasks = useMemo(() => {
    return state.cases
      .flatMap((item) =>
        (item.tasks ?? [])
          .filter((task) => !task.done)
          .map((task) => ({ ...task, case_title: item.title })),
      )
      .sort((a, b) => (priorityRank[a.priority ?? "mittel"] - priorityRank[b.priority ?? "mittel"]))
      .slice(0, 5);
  }, [state.cases]);

  const notes = useMemo(() => {
    return state.cases
      .flatMap((item) =>
        (item.notes_excerpt ?? []).map((note) => ({ note, case_title: item.title })),
      )
      .sort((a, b) => (priorityRank[a.note.priority ?? "mittel"] - priorityRank[b.note.priority ?? "mittel"]))
      .slice(0, 5);
  }, [state.cases]);

  const deadlines: DeadlineItem[] = useMemo(() => {
    if (state.deadlines && state.deadlines.length > 0) return state.deadlines;
    return state.cases
      .filter((item) => item.deadline_date)
      .map((item) => ({
        id: `deadline-${item.id}`,
        case_id: item.id,
        case_title: item.title,
        label: 'Frist',
        due_date: item.deadline_date!,
        next_action: item.next_action,
      }));
  }, [state.deadlines, state.cases]);

  const getDueIn = (item: DeadlineItem) =>
    typeof item.due_in_business_days === 'number'
      ? item.due_in_business_days
      : differenceInCalendarDays(parseISO(item.due_date), new Date());

  const filteredDeadlines = useMemo(() => {
    return deadlines.filter((item) => {
      const dueIn = getDueIn(item);
      if (filter === 'overdue') return dueIn < 0;
      if (filter === 'due3') return dueIn >= 0 && dueIn <= 3;
      if (filter === 'due10') return dueIn >= 0 && dueIn <= 10;
      return true;
    });
  }, [deadlines, filter]);

  const topCritical = [...filteredDeadlines]
    .sort((a, b) => getDueIn(a) - getDueIn(b))
    .slice(0, 5);

  const upcoming = filteredDeadlines
    .filter((item) => {
      const dueIn = getDueIn(item);
      return dueIn >= 0 && dueIn <= 7;
    })
    .sort((a, b) => getDueIn(a) - getDueIn(b));

  return (
    <div className="screen">
      <header className="screen-header">
        <h1>Recht · Übersicht</h1>
        <p>Fristen und nächste Schritte auf einen Blick.</p>
      </header>
      <section className="kpi-grid">
        <button
          type="button"
          className={`kpi-card clickable${filter === 'overdue' ? ' active' : ''}`}
          onClick={() => setFilter(filter === 'overdue' ? 'all' : 'overdue')}
        >
          <span>Überfällig</span>
          <strong>{metrics.deadlineStats.overdue}</strong>
        </button>
        <button
          type="button"
          className={`kpi-card clickable${filter === 'due3' ? ' active' : ''}`}
          onClick={() => setFilter(filter === 'due3' ? 'all' : 'due3')}
        >
          <span>≤ 3 Werktage</span>
          <strong>{metrics.deadlineStats.due3}</strong>
        </button>
        <button
          type="button"
          className={`kpi-card clickable${filter === 'due10' ? ' active' : ''}`}
          onClick={() => setFilter(filter === 'due10' ? 'all' : 'due10')}
        >
          <span>≤ 10 Werktage</span>
          <strong>{metrics.deadlineStats.due10}</strong>
        </button>
        <div className="kpi-card">
          <span>Aktive Fälle</span>
          <strong>{metrics.activeCases}</strong>
        </div>
      </section>

      <section className="panel">
        <h2>Top kritisch</h2>
        <div className="focus-list">
          {topCritical.map((item) => (
            <button key={item.id} className="focus-item clickable" onClick={() => setSelected(item)}>
              <div>
                <strong>{item.case_title}</strong>
                <span className="muted">{item.label}</span>
              </div>
              <div className="focus-action">
                {item.next_action || 'Nächster Schritt fehlt'}
              </div>
            </button>
          ))}
          {topCritical.length === 0 && <p className="muted">Keine kritischen Fristen.</p>}
        </div>
      </section>

      <section className="panel">
        <h2>Nächste 7 Tage</h2>
        <div className="table">
          <div className="table-row table-head">
            <span>Fall</span>
            <span>Frist</span>
            <span>Fällig</span>
            <span>Status</span>
          </div>
          {upcoming.map((item) => (
            <button
              key={item.id}
              className="table-row clickable"
              onClick={() => setSelected(item)}
              type="button"
            >
              <span>{item.case_title}</span>
              <span>{item.label}</span>
              <span>{format(parseISO(item.due_date), 'dd.MM.yyyy')}</span>
              <span className={`badge badge-${deadlineStatus(item)}`}>
                {deadlineStatus(item)}
              </span>
            </button>
          ))}
          {upcoming.length === 0 && <p className="muted">Keine Fristen in den nächsten 7 Tagen.</p>}
        </div>
      </section>


      <section className="panel">
        <div className="panel-grid">
          <div>
            <h2>Aufgaben (Auszug)</h2>
            {tasks.length > 0 ? (
              <ul className="mini-list">
                {tasks.map((task, index) => (
                  <li key={`task-${index}`} className="mini-item">
                    <span className="muted">•</span>
                    <div className="mini-content">
                      <span>
                        {task.text} · <em>{task.case_title}</em>
                      </span>
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
              <p className="muted">Keine offenen Aufgaben.</p>
            )}
          </div>
          <div>
            <h2>Notizen (Auszug)</h2>
            {notes.length > 0 ? (
              <ul className="mini-list">
                {notes.map((note, index) => (
                  <li key={`note-${index}`} className="mini-item">
                    <span className="muted">•</span>
                    <div className="mini-content">
                      <span>
                        {note.note.text} · <em>{note.case_title}</em>
                      </span>
                      {(note.note.priority || note.note.label || (note.note.tags && note.note.tags.length > 0)) && (
                        <div className="chip-row">
                          {note.note.priority && (
                            <span className={`chip chip-priority-${note.note.priority}`}>
                              {priorityLabel[note.note.priority]}
                            </span>
                          )}
                          {note.note.label && <span className="chip chip-label">{note.note.label}</span>}
                          {note.note.tags?.map((tag) => (
                            <span key={tag} className="chip chip-tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Keine Notizen vorhanden.</p>
            )}
          </div>
        </div>
      </section>

      <InsightsPanel />

      {selected && (
        <div className="drawer-backdrop" onClick={() => setSelected(null)}>
          <div className="drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h3>{selected.case_title}</h3>
                <p className="muted">{selected.label}</p>
              </div>
              <button className="secondary" onClick={() => setSelected(null)}>
                Schließen
              </button>
            </div>
            <div className="drawer-section">
              <div>
                <span className="muted">Fällig am</span>
                <strong>{format(parseISO(selected.due_date), 'dd.MM.yyyy')}</strong>
              </div>
              <div>
                <span className="muted">Werktage übrig</span>
                <strong>{getDueIn(selected)}</strong>
              </div>
              <div>
                <span className="muted">Status</span>
                <span className={`badge badge-${deadlineStatus(selected)}`}>
                  {deadlineStatus(selected)}
                </span>
              </div>
            </div>
            {selected.next_action && (
              <div className="drawer-section">
                <span className="muted">Nächster Schritt</span>
                <p>{selected.next_action}</p>
              </div>
            )}
            {selected.rule && (
              <div className="drawer-section">
                <span className="muted">Regel</span>
                <p>{selected.rule}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
