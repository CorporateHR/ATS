-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES user_roles(role_id),
    component_name VARCHAR(50) NOT NULL,
    access_level VARCHAR(20) CHECK (access_level IN ('read', 'write', 'no_view')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, component_name)
);

-- Create user_role_assignments table
CREATE TABLE IF NOT EXISTS user_role_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    role_id UUID REFERENCES user_roles(role_id),
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_id ON user_role_assignments(role_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for role_permissions
DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON role_permissions;
CREATE TRIGGER update_role_permissions_updated_at
    BEFORE UPDATE ON role_permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles
INSERT INTO user_roles (role_name, is_active) VALUES
('Super Admin', true),
('Admin', true),
('Manager', true),
('Recruiter', true)
ON CONFLICT (role_id) DO NOTHING;

-- Insert default permissions for components
INSERT INTO role_permissions (role_id, component_name, access_level)
SELECT 
    r.role_id,
    c.component_name,
    CASE 
        WHEN r.role_name = 'Super Admin' THEN 'write'
        WHEN r.role_name = 'Admin' THEN 'write'
        WHEN r.role_name = 'Manager' AND c.component_name IN ('dashboard', 'jobs', 'candidates', 'team') THEN 'write'
        WHEN r.role_name = 'Manager' THEN 'read'
        WHEN r.role_name = 'Recruiter' AND c.component_name IN ('jobs', 'candidates') THEN 'write'
        WHEN r.role_name = 'Recruiter' AND c.component_name = 'dashboard' THEN 'read'
        ELSE 'no_view'
    END as access_level
FROM user_roles r
CROSS JOIN (
    VALUES 
        ('dashboard'),
        ('jobs'),
        ('candidates'),
        ('clients'),
        ('team'),
        ('masters'),
        ('settings')
) as c(component_name)
ON CONFLICT (role_id, component_name) DO UPDATE
SET access_level = EXCLUDED.access_level;