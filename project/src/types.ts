import type { Database } from './lib/database.types';

export type Client = Database['public']['Tables']['clients']['Row'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Agency = Database['public']['Tables']['agencies']['Row'];
export type AgencyInsert = Database['public']['Tables']['agencies']['Insert'];
export type AgencyUpdate = Database['public']['Tables']['agencies']['Update'];

export type Candidate = Database['public']['Tables']['candidates']['Row'];
export type CandidateInsert = Database['public']['Tables']['candidates']['Insert'];
export type CandidateUpdate = Database['public']['Tables']['candidates']['Update'];

export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamInsert = Database['public']['Tables']['teams']['Insert'];
export type TeamUpdate = Database['public']['Tables']['teams']['Update'];

export type Spoc = Database['public']['Tables']['spocs']['Row'];
export type SpocInsert = Database['public']['Tables']['spocs']['Insert'];
export type SpocUpdate = Database['public']['Tables']['spocs']['Update'];
