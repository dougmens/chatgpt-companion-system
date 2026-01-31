import { addDays, isBefore, parseISO } from 'date-fns';
import { CaseItem, Incident, EvidenceItem } from './types';

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

export const countOpenIncidents = (incidents: Incident[]): number =>
  incidents.filter((item) => ['neu', 'offen', 'in_klaerung'].includes(item.status)).length;

export const countUnassignedEvidence = (evidence: EvidenceItem[]): number =>
  evidence.filter((item) => !item.case_id && !item.incident_id).length;

export const kpis = (cases: CaseItem[], incidents: Incident[], evidence: EvidenceItem[]) => ({
  activeCases: cases.filter((item) =>
    ['aktiv', 'pruefen', 'finalisieren', 'wartet'].includes(item.status),
  ).length,
  criticalCases: cases.filter((item) => deriveCaseState(item) === 'kritisch').length,
  deadlines14: countDeadlinesWithin(cases, 14),
  incidentsOpen: countOpenIncidents(incidents),
  evidenceUntriaged: countUnassignedEvidence(evidence),
});
