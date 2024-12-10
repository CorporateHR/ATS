-- Insert sample agency
INSERT INTO agencies (id, name, subscription) VALUES
('a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'RecruitPro Agency', 'pro');

-- Insert sample users (team members)
INSERT INTO users (id, name, email, mobile, role, agency_id) VALUES
('u1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Sarah Wilson', 'sarah@recruitpro.com', '+1 (555) 123-4567', 'admin', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('u2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Mike Thompson', 'mike@recruitpro.com', '+1 (555) 234-5678', 'manager', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('u3b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Emily Davis', 'emily@recruitpro.com', '+1 (555) 345-6789', 'recruiter', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f');

-- Update reporting structure
UPDATE users 
SET reports_to = 'u1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f' 
WHERE id IN ('u2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'u3b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f');

-- Insert sample clients
INSERT INTO clients (id, name, industry, agency_id) VALUES
('c1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'TechCorp Solutions', 'Technology', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('c2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Finance Pro', 'Finance', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f');

-- Insert SPOCs
INSERT INTO spocs (id, name, email, phone, type, designation, client_id) VALUES
('s1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'John Smith', 'john@techcorp.com', '+1 (555) 123-4567', 'external', 'HR Manager', 'c1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('s2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Sarah Johnson', 'sarah.j@techcorp.com', '+1 (555) 234-5678', 'internal', 'Recruitment Lead', 'c1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('s3b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Michael Brown', 'michael@financepro.com', '+1 (555) 345-6789', 'external', 'Talent Acquisition Manager', 'c2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f');

-- Insert sample jobs
INSERT INTO jobs (id, title, description, requirements, client_id, status, internal_spoc_id, external_spoc_id, agency_id) VALUES
('j1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 
 'Senior Frontend Developer', 
 'We are looking for an experienced Frontend Developer with React expertise.',
 ARRAY['5+ years React', 'TypeScript', 'State Management'],
 'c1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'open',
 's2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 's1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f');

-- Insert recruitment stages for the job
INSERT INTO recruitment_stages (id, name, description, order_number, is_active, job_id, agency_id) VALUES
('r1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Initial Screening', 'Review of candidate profile and resume', 1, true, 'j1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('r2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Technical Assessment', 'Online coding test and technical evaluation', 2, true, 'j1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('r3b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Technical Interview', 'In-depth technical discussion', 3, true, 'j1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('r4b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'HR Interview', 'Discussion of cultural fit and expectations', 4, true, 'j1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('r5b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'Final Interview', 'Meeting with senior management', 5, true, 'j1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f', 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f');

-- Insert sample candidates
INSERT INTO candidates (id, name, email, phone, current_company, current_designation, experience, skills, resume_url, agency_id) VALUES
('cd1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'John Doe',
 'john.doe@email.com',
 '+1 (555) 987-6543',
 'Tech Corp',
 'Senior Developer',
 5,
 ARRAY['React', 'TypeScript', 'Node.js'],
 'https://example.com/resumes/johndoe.pdf',
 'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f');

-- Insert candidate application
INSERT INTO candidate_jobs (id, candidate_id, job_id, status, current_stage_id) VALUES
('cj1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'cd1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'j1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'in-progress',
 'r2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f');

-- Insert stage history
INSERT INTO stage_history (id, candidate_job_id, stage_id, notes, updated_by) VALUES
('sh1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'cj1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'r1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'Strong profile, good experience with required technologies',
 'u3b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f'),
('sh2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'cj1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'r2b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
 'Technical assessment scheduled for next week',
 'u3b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f');