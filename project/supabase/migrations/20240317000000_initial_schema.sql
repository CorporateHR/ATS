-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'recruiter', 'manager');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'on-hold');
CREATE TYPE spoc_type AS ENUM ('internal', 'external');
CREATE TYPE candidate_status AS ENUM ('new', 'in-progress', 'rejected', 'hired');
CREATE TYPE subscription_type AS ENUM ('basic', 'pro', 'enterprise');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired');

-- Create agencies table
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  team_size INTEGER NOT NULL,
  subscription subscription_type NOT NULL DEFAULT 'basic',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create users table with auth integration
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'recruiter',
  designation TEXT,
  reports_to UUID REFERENCES users(id),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  designation TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'recruiter',
  reports_to UUID REFERENCES users(id),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES users(id),
  status invitation_status DEFAULT 'pending',
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(email, agency_id)
);

-- Rest of the tables remain the same
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE spocs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  type spoc_type NOT NULL,
  designation TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  status job_status NOT NULL DEFAULT 'open',
  internal_spoc_id UUID REFERENCES spocs(id),
  external_spoc_id UUID REFERENCES spocs(id),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE recruitment_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  current_company TEXT,
  current_designation TEXT,
  experience NUMERIC NOT NULL,
  skills TEXT[] NOT NULL,
  resume_url TEXT,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE candidate_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  status candidate_status NOT NULL DEFAULT 'new',
  current_stage_id UUID REFERENCES recruitment_stages(id),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE stage_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_job_id UUID REFERENCES candidate_jobs(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES recruitment_stages(id) ON DELETE CASCADE,
  notes TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_users_agency ON users(agency_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_agency ON invitations(agency_id);
CREATE INDEX idx_clients_agency ON clients(agency_id);
CREATE INDEX idx_spocs_client ON spocs(client_id);
CREATE INDEX idx_jobs_agency ON jobs(agency_id);
CREATE INDEX idx_jobs_client ON jobs(client_id);
CREATE INDEX idx_candidates_agency ON candidates(agency_id);
CREATE INDEX idx_candidate_jobs_candidate ON candidate_jobs(candidate_id);
CREATE INDEX idx_candidate_jobs_job ON candidate_jobs(job_id);
CREATE INDEX idx_stage_history_candidate_job ON stage_history(candidate_job_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at
    BEFORE UPDATE ON invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spocs_updated_at
    BEFORE UPDATE ON spocs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruitment_stages_updated_at
    BEFORE UPDATE ON recruitment_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
    BEFORE UPDATE ON candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_jobs_updated_at
    BEFORE UPDATE ON candidate_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE spocs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_history ENABLE ROW LEVEL SECURITY;

-- Agency policies
CREATE POLICY "Users can view their own agency"
    ON agencies FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM users WHERE agency_id = agencies.id
    ));

CREATE POLICY "Only authenticated users can create agencies"
    ON agencies FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- User policies
CREATE POLICY "Users can view members of their agency"
    ON users FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM users WHERE agency_id = users.agency_id
    ));

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Invitation policies
CREATE POLICY "Admin can manage invitations"
    ON invitations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.agency_id = invitations.agency_id
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can view invitations for their agency"
    ON invitations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.agency_id = invitations.agency_id
        )
    );