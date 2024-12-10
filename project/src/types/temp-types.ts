// Temporary type definitions until database types are updated

export interface BaseClient {
  id?: string;
  name: string;
  industry: string;
  agency_id: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface BaseSpoc {
  id?: string;
  name: string;
  email: string;
  phone: string;
  type: 'internal' | 'external';
  designation: string;
  client_id: string;
  created_at?: string;
  updated_at?: string;
}

export type Client = BaseClient;
export type ClientInsert = Omit<BaseClient, 'id' | 'created_at' | 'updated_at'>;
export type ClientUpdate = Partial<BaseClient>;

export type Spoc = BaseSpoc;
export type SpocInsert = Omit<BaseSpoc, 'id' | 'created_at' | 'updated_at'>;
export type SpocUpdate = Partial<BaseSpoc>;
