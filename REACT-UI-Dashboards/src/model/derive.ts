import { addDays, isBefore, parseISO, differenceInCalendarDays } from 'date-fns';
import { CaseItem, Incident, EvidenceItem, DeadlineItem } from './types';

export type CaseDerivedState = 'wartet' | 'kritisch' | 'ruhig';

export const deriveCaseState = (item: CaseItem): CaseDerivedState => {
  if (item.status === 'wartet') {
    return 'wartet';
  }
  if (item.risk_level === 'hoch') {
    return 'kritisch';
  }
  if (item.deadline_date) {
    const deadline = parseISO(item.deadline_date);
    const cutoff = addDays(new Date(), 7);
    if (isBefore(deadline, cutoff) || deadline.toDateString() === cutoff.toDateString()) {
      return 'kritisch';
    }
  }
  return 'ruhig';
};

export const countDeadlinesWithin = (cases: CaseItem[], days: number): number => {
  const cutoff = addDays(new Date(), days);
  return cases.filter((item) => {
    if (!item.deadline_date || item.status === 'archiv' || item.status === 'erledigt') {
      return false;
    }
    const deadline = parseISO(item.deadline_date);
    return isBefore(deadline, cutoff) || deadline.toDateString() === cutoff.toDateString();
  }).length;
};

const getDueInDays = (deadline: DeadlineItem): number => {
  if (typeof deadline.due_in_business_days === 'number') {
    return deadline.due_in_business_days;
  }
  return differenceInCalendarDays(parseISO(deadline.due_date), new Date());
};

export const deadlineStatus = (deadline: DeadlineItem): 'overdue' | 'soon' | 'ok' => {
  if (deadline.status) {
    return deadline.status;
  }
  const dueIn = getDueInDays(deadline);
  if (dueIn < 0) return 'overdue';
  if (dueIn <= 3) return 'soon';
  return 'ok';
};

export const countDeadlinesByStatus = (deadlines: DeadlineItem[]) => {
  const overdue = deadlines.filter((d) => deadlineStatus(d) === 'overdue').length;
  const due3 = deadlines.filter((d) => deadlineStatus(d) === 'soon').length;
  const due10 = deadlines.filter((d) => {
    const dueIn = getDueInDays(d);
    return dueIn >= 0 && dueIn <= 10;
  }).length;
  return { overdue, due3, due10 };
};

export const countOpenIncidents = (incidents: Incident[]): number =>
  incidents.filter((item) => ['neu', 'offen', 'in_klaerung'].includes(item.status)).length;

export const countUnassignedEvidence = (evidence: EvidenceItem[]): number =>
  evidence.filter((item) => !item.case_id && !item.incident_id).length;

export const kpis = (
  cases: CaseItem[],
  incidents: Incident[],
  evidence: EvidenceItem[],
  deadlines: DeadlineItem[],
) => ({
  activeCases: cases.filter((item) =>
    ['aktiv', 'pruefen', 'finalisieren', 'wartet'].includes(item.status),
  ).length,
  criticalCases: cases.filter((item) => deriveCaseState(item) === 'kritisch').length,
  deadlines14: countDeadlinesWithin(cases, 14),
  deadlineStats: countDeadlinesByStatus(deadlines),
  incidentsOpen: countOpenIncidents(incidents),
  evidenceUntriaged: countUnassignedEvidence(evidence),
});
