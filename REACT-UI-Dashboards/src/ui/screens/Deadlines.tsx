import React, { useMemo, useState } from 'react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { useStore } from '../state/Store';
import { deadlineStatus } from '../../model/derive';
import type { DeadlineItem } from '../../model/types';

const rangeOptions = [7, 14, 30] as const;
type RangeOption = (typeof rangeOptions)[number] | 'all';

export const Deadlines: React.FC = () => {
  const { state } = useStore();
  const [range, setRange] = useState<RangeOption>(14);
  const [statusFilter, setStatusFilter] = useState<'all' | 'overdue' | 'soon' | 'ok'>('all');
  const [selected, setSelected] = useState<DeadlineItem | null>(null);

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

  const filtered = useMemo(() => {
    return deadlines
      .filter((item) => {
        const dueIn = getDueIn(item);
        if (range !== 'all' && dueIn > range) return false;
        if (statusFilter !== 'all' && deadlineStatus(item) !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => getDueIn(a) - getDueIn(b));
  }, [deadlines, range, statusFilter]);

  return (
    <div className="screen">
      <header className="screen-header">
        <h1>Recht · Fristen</h1>
        <p>Alle Fristen mit Werktag-Berechnung (BY, vorheriger Werktag).</p>
      </header>

      <section className="panel compact filters">
        <div className="filters-group">
          <span className="muted">Zeitraum</span>
          <select
            value={range}
            onChange={(event) => {
              const value = event.target.value;
              setRange(value === 'all' ? 'all' : (Number(value) as RangeOption));
            }}
          >
            <option value="all">Alle</option>
            {rangeOptions.map((value) => (
              <option key={value} value={value}>
                {value} Tage
              </option>
            ))}
          </select>
        </div>
        <div className="filters-group">
          <span className="muted">Status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as any)}>
            <option value="all">Alle</option>
            <option value="overdue">Überfällig</option>
            <option value="soon">Bald fällig</option>
            <option value="ok">Ok</option>
          </select>
        </div>
      </section>

      <section className="panel">
        <div className="table">
          <div className="table-row table-head deadlines-head">
            <span>Fall</span>
            <span>Frist</span>
            <span>Fällig</span>
            <span>Werktage übrig</span>
            <span>Status</span>
          </div>
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className="table-row clickable deadlines-row"
              onClick={() => setSelected(item)}
            >
              <span>{item.case_title}</span>
              <span>{item.label}</span>
              <span>{format(parseISO(item.due_date), 'dd.MM.yyyy')}</span>
              <span>{getDueIn(item)}</span>
              <span className={`badge badge-${deadlineStatus(item)}`}>
                {deadlineStatus(item)}
              </span>
            </button>
          ))}
          {filtered.length === 0 && <p className="muted">Keine Fristen im gewählten Zeitraum.</p>}
        </div>
      </section>

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
            {selected.received_date && (
              <div className="drawer-section">
                <span className="muted">Zugang</span>
                <p>{selected.received_date}</p>
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
