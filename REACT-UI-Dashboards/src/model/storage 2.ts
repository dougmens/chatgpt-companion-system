import { AppState, CaseItem, Incident, EvidenceItem } from './types';
import { addDays, formatISO } from 'date-fns';

const STORAGE_KEY = 'companion_dashboard_v1';

const nowIso = () => new Date().toISOString();

const seedCase: CaseItem = {
  id: 'case-1',
  title: 'Räumung Pullach',
  domain: 'recht',
  category: 'raeumung',
  status: 'aktiv',
  risk_level: 'hoch',
  next_action: 'Fristverlängerung beim Gericht beantragen.',
  deadline_date: formatISO(addDays(new Date(), 10), { representation: 'date' }),
  deadline_type: 'gericht',
  last_update_at: nowIso(),
  owner: 'Ich',
  tags: ['frist', 'wohnung'],
  court: 'AG München',
  file_reference: 'AZ-2024-001',
  counterparty: 'Vermieter GmbH',
  lawyer: 'Kanzlei Lorenz',
};

const seedIncident: Incident = {
  id: 'incident-1',
  title: 'USB-Buchse beschädigt',
  incident_date: formatISO(addDays(new Date(), -4), { representation: 'date' }),
  status: 'offen',
  evidence_strength: 'mittel',
  summary: 'USB-Port am Laptop wackelt seit dem Umzug.\nStecker sitzt locker.\nGerät lädt nur in bestimmter Position.',
  related_case_id: 'case-1',
  last_update_at: nowIso(),
  location: 'Wohnung Pullach',
  estimated_damage_eur: 120,
  witnesses: ['Nachbarin'],
};

const seedEvidence: EvidenceItem = {
  id: 'evidence-1',
  title: 'Foto USB-Abdeckung',
  type: 'foto',
  source: 'kamera',
  date_created: formatISO(addDays(new Date(), -3), { representation: 'date' }),
  incident_id: 'incident-1',
  is_attachment_ready: false,
  label: 'K1',
};

export const getSeedState = (): AppState => ({
  cases: [seedCase],
  incidents: [seedIncident],
  evidence: [seedEvidence],
  logs: [
    {
      id: 'log-1',
      entity_type: 'case',
      entity_id: 'case-1',
      at: nowIso(),
      text: 'Fall angelegt.',
      author: 'System',
    },
    {
      id: 'log-2',
      entity_type: 'incident',
      entity_id: 'incident-1',
      at: nowIso(),
      text: 'Schaden dokumentiert.',
      author: 'System',
    },
    {
      id: 'log-3',
      entity_type: 'incident',
      entity_id: 'incident-1',
      at: nowIso(),
      text: 'Beweis hinzugefügt.',
      author: 'System',
    },
  ],
});

export const seedIfEmpty = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seeded = getSeedState();
    saveState(seeded);
    return seeded;
  }
  return loadState();
};

export const loadState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return getSeedState();
  }
  try {
    const parsed = JSON.parse(stored) as AppState;
    if (!parsed.cases || !parsed.incidents || !parsed.evidence || !parsed.logs) {
      return getSeedState();
    }
    return parsed;
  } catch {
    return getSeedState();
  }
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const resetState = () => {
  const state = getSeedState();
  saveState(state);
  return state;
};
