import { useAuthStore } from '../store/auth';

type UserRole = 'admin' | 'recruiter' | 'manager';

interface Permission {
  action: string;
  subject: string;
}

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { action: 'manage', subject: 'all' }, // Admins can do everything
  ],
  manager: [
    { action: 'read', subject: 'candidates' },
    { action: 'write', subject: 'candidates' },
    { action: 'read', subject: 'jobs' },
    { action: 'write', subject: 'jobs' },
    { action: 'read', subject: 'team' },
    { action: 'write', subject: 'team' },
    { action: 'read', subject: 'reports' },
  ],
  recruiter: [
    { action: 'read', subject: 'candidates' },
    { action: 'write', subject: 'candidates' },
    { action: 'read', subject: 'jobs' },
    { action: 'read', subject: 'team' },
  ],
};

export function usePermissions() {
  const { user } = useAuthStore();

  const can = (action: string, subject: string): boolean => {
    if (!user) return false;

    const userPermissions = rolePermissions[user.role];
    
    // Check if user has wildcard permission
    if (userPermissions.some(p => p.action === 'manage' && p.subject === 'all')) {
      return true;
    }

    // Check specific permission
    return userPermissions.some(
      p => p.action === action && p.subject === subject
    );
  };

  return { can };
}
