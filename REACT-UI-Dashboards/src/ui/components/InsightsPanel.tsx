import React, { useMemo, useState } from 'react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { useStore } from '../state/Store';
import { deadlineStatus, kpis } from '../../model/derive';
import type { DeadlineItem } from '../../model/types';

type InsightTone = 'info' | 'warn' | 'danger';

type InsightCard = {
  id: string;
  title: string;
  description: string;
  tone: InsightTone;
  actionLabel?: string;
  actionHref?: string;
};

const getDueIn = (item: DeadlineItem) =>
  typeof item.due_in_business_days === 'number'
    ? item.due_in_business_days
    : differenceInCalendarDays(parseISO(item.due_date), new Date());

export const InsightsPanel: React.FC = () => {
  const { state } = useStore();
  const metrics = kpis(state.cases, state.incidents, state.evidence, state.deadlines);

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

  const earliest = [...deadlines].sort((a, b) => getDueIn(a) - getDueIn(b))[0];
  const dueIn = earliest ? getDueIn(earliest) : null;

  const cards: InsightCard[] = [];

  if (earliest) {
    cards.push({
      id: 'next-deadline',
      title: `Nächste Frist: ${earliest.label}`,
      description: `${earliest.case_title} · fällig am ${format(parseISO(earliest.due_date), 'dd.MM.yyyy')} (${dueIn} Werktage).`,
      tone: deadlineStatus(earliest) === 'overdue' ? 'danger' : deadlineStatus(earliest) === 'soon' ? 'warn' : 'info',
      actionLabel: 'Fristen öffnen',
      actionHref: '/deadlines',
    });
  }

  if (metrics.deadlineStats.overdue > 0) {
    cards.push({
      id: 'overdue',
      title: 'Überfällige Fristen',
      description: `Es gibt ${metrics.deadlineStats.overdue} überfällige Frist(en). Bitte sofort prüfen.`,
      tone: 'danger',
      actionLabel: 'Fristen öffnen',
      actionHref: '/deadlines',
    });
  }

  if (metrics.deadlineStats.due10 >= 3) {
    cards.push({
      id: 'trend',
      title: 'Trend-Alarm',
      description: `${metrics.deadlineStats.due10} Fristen liegen in den nächsten 10 Werktagen.`,
      tone: 'warn',
      actionLabel: 'Priorisieren',
      actionHref: '/deadlines',
    });
  }

  if (cards.length === 0) {
    cards.push({
      id: 'quiet',
      title: 'Keine kritischen Hinweise',
      description: 'Aktuell keine dringenden Fristen oder Risiken erkannt.',
      tone: 'info',
    });
  }

  const suggestions = deadlines
    .filter((item) => item.next_action)
    .slice(0, 4);

  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>AI-Insights</h2>
          <p className="muted">KI-Hinweise – keine Rechtsberatung.</p>
        </div>
        <span className="badge badge-info">Companion</span>
      </div>

      <div className="insight-grid">
        {cards.map((card) => (
          <div key={card.id} className={`insight-card insight-${card.tone}`}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            {card.actionHref && card.actionLabel && (
              <Link to={card.actionHref} className="link-button">
                {card.actionLabel}
              </Link>
            )}
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="insight-todos">
          <h3>Vorgeschlagene nächste Schritte</h3>
          <div className="insight-todo-list">
            {suggestions.map((item) => (
              <label key={item.id} className="insight-todo-item">
                <input
                  type="checkbox"
                  checked={!!accepted[item.id]}
                  onChange={() =>
                    setAccepted((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                />
                <span>
                  {item.next_action} · <em>{item.case_title}</em>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
