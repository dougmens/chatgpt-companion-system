export type Domain = 'recht' | 'organisation' | 'finanzen' | 'projekt';
export type CaseCategory = 'raeumung' | 'familie' | 'bank' | 'sonstiges';
export type CaseStatus =
  | 'neu'
  | 'aktiv'
  | 'wartet'
  | 'pruefen'
  | 'finalisieren'
  | 'erledigt'
  | 'archiv';
export type RiskLevel = 'niedrig' | 'mittel' | 'hoch';
export type IncidentStatus = 'neu' | 'offen' | 'in_klaerung' | 'abgeschlossen' | 'archiv';
export type EvidenceStrength = 'schwach' | 'mittel' | 'stark';
export type EvidenceType = 'foto' | 'pdf' | 'mail' | 'chat' | 'rechnung' | 'sonstiges';
export type EvidenceSource = 'scan' | 'kamera' | 'gmail' | 'whatsapp' | 'notiz' | 'download' | 'sonstiges';

export interface CaseItem {
  id: string;
  title: string;
  domain: Domain;
  category: CaseCategory;
  status: CaseStatus;
  risk_level: RiskLevel;
  next_action: string;
  deadline_date?: string;
  deadline_type?: 'gericht' | 'anwalt' | 'behoerde' | 'vertrag' | 'sonstiges';
  last_update_at: string;
  owner: string;
  tags?: string[];
  court?: string;
  file_reference?: string;
  counterparty?: string;
  lawyer?: string;
  next_hearing_date?: string;
}

export interface Incident {
  id: string;
  title: string;
  incident_date: string;
  status: IncidentStatus;
  evidence_strength: EvidenceStrength;
  summary: string;
  related_case_id?: string;
  last_update_at: string;
  location?: string;
  estimated_damage_eur?: number;
  intent_suspected?: boolean;
  witnesses?: string[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: EvidenceType;
  source: EvidenceSource;
  file_url?: string;
  file_path?: string;
  date_created?: string;
  case_id?: string;
  incident_id?: string;
  is_attachment_ready: boolean;
  label?: string;
}

export interface ActionLog {
  id: string;
  entity_type: 'case' | 'incident';
  entity_id: string;
  at: string;
  text: string;
  author: string;
}

export interface AppState {
  cases: CaseItem[];
  incidents: Incident[];
  evidence: EvidenceItem[];
  logs: ActionLog[];
}
