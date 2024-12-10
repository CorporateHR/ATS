export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          subscription: 'basic' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subscription?: 'basic' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subscription?: 'basic' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          mobile: string
          role: 'admin' | 'recruiter' | 'manager'
          reports_to: string | null
          agency_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          mobile: string
          role?: 'admin' | 'recruiter' | 'manager'
          reports_to?: string | null
          agency_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          mobile?: string
          role?: 'admin' | 'recruiter' | 'manager'
          reports_to?: string | null
          agency_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          industry: string
          agency_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry: string
          agency_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string
          agency_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      spocs: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          type: 'internal' | 'external'
          designation: string
          client_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          type: 'internal' | 'external'
          designation: string
          client_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          type?: 'internal' | 'external'
          designation?: string
          client_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          description: string
          requirements: string[]
          responsibilities: string[]
          status: 'open' | 'closed' | 'on-hold'
          agency_id: string
          created_at: string
          updated_at: string
          location: string
          salary_range_start: number
          salary_range_end: number
          job_type: string
          experience_level: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          requirements: string[]
          responsibilities: string[]
          status?: 'open' | 'closed' | 'on-hold'
          agency_id: string
          created_at?: string
          updated_at?: string
          location: string
          salary_range_start: number
          salary_range_end: number
          job_type: string
          experience_level: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          requirements?: string[]
          responsibilities?: string[]
          status?: 'open' | 'closed' | 'on-hold'
          agency_id?: string
          created_at?: string
          updated_at?: string
          location?: string
          salary_range_start?: number
          salary_range_end?: number
          job_type?: string
          experience_level?: string
          created_by?: string
        }
      }
      recruitment_stages: {
        Row: {
          id: string
          name: string
          description: string | null
          order_number: number
          is_active: boolean
          job_id: string
          agency_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          order_number: number
          is_active?: boolean
          job_id: string
          agency_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          order_number?: number
          is_active?: boolean
          job_id?: string
          agency_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          current_company: string | null
          current_designation: string | null
          experience: number
          skills: string[]
          resume_url: string | null
          agency_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          current_company?: string | null
          current_designation?: string | null
          experience: number
          skills: string[]
          resume_url?: string | null
          agency_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          current_company?: string | null
          current_designation?: string | null
          experience?: number
          skills?: string[]
          resume_url?: string | null
          agency_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      candidate_jobs: {
        Row: {
          id: string
          candidate_id: string
          job_id: string
          status: 'new' | 'in-progress' | 'rejected' | 'hired'
          current_stage_id: string | null
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          job_id: string
          status?: 'new' | 'in-progress' | 'rejected' | 'hired'
          current_stage_id?: string | null
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          job_id?: string
          status?: 'new' | 'in-progress' | 'rejected' | 'hired'
          current_stage_id?: string | null
          applied_at?: string
          updated_at?: string
        }
      }
      stage_history: {
        Row: {
          id: string
          candidate_job_id: string
          stage_id: string
          notes: string | null
          updated_by: string
          created_at: string
        }
        Insert: {
          id?: string
          candidate_job_id: string
          stage_id: string
          notes?: string | null
          updated_by: string
          created_at?: string
        }
        Update: {
          id?: string
          candidate_job_id?: string
          stage_id?: string
          notes?: string | null
          updated_by?: string
          created_at?: string
        }
      }
    }
  }
}
