export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  current_company: string | null;
  current_designation: string | null;
  experience: number;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Expert';
  }>;
  resume_url: string | null;
  agency_id: string;
  status: 'Active' | 'Inactive' | 'In Process' | 'On Hold';
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    score?: string;
  }>;
  work_history: Array<{
    company: string;
    position: string;
    duration: string;
    description?: string;
  }>;
  notes: Array<{
    id: string;
    content: string;
    created_at: string;
    created_by: string;
  }>;
  created_at: string;
  updated_at: string;
}
