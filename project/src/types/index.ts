export interface Column {
  id: string;
  title: string;
  color: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'admin' | 'recruiter' | 'manager';
  reportsTo: string;
  agencyId: string;
}

export interface SPOC {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'internal' | 'external';
  designation: string;
  clientId: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  clientId: string;
  status: 'open' | 'closed' | 'on-hold';
  created_at: string;
  updated_at: string;
  internalSpocId: string;
  externalSpocId: string;
  recruitmentProcess: RecruitmentStage[];
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  spocs: SPOC[];
}

export interface RecruitmentStage {
  id: string;
  name: string;
  order: number;
  description: string;
  isActive: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  current_company: string | null;
  current_designation: string | null;
  experience: number;
  skills: string[];
  resume_url: string | null;
  agency_id: string;
  created_at: string;
  updated_at: string;
  status?: 'Active' | 'Inactive' | 'In Process';
}
