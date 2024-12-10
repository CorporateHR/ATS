import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  ChevronDown,
  Settings,
  Shield,
} from 'lucide-react';
import { usePermissions } from '@/utils/permissions';
import { useAuthStore } from '@/store/auth';

interface NavItemProps {
  to: string;
  icon: React.ReactElement;
  text: string;
  isActive: boolean;
  isSubItem?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  endIcon?: React.ReactElement;
}

function NavItem({ to, icon, text, isActive, isSubItem = false, onClick, endIcon }: NavItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      } ${isSubItem ? 'text-sm' : ''}`}
    >
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
      <span className="flex-1 font-medium">{text}</span>
      {endIcon && endIcon}
    </Link>
  );
}

export default function Navbar() {
  const [openSection, setOpenSection] = useState<'candidates' | 'masters' | null>(null);
  const location = useLocation();
  const { can } = usePermissions();
  const { user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;
  const isCandidatesActive = location.pathname.startsWith('/candidates');
  const isMastersActive = location.pathname.startsWith('/masters');

  const toggleSection = (section: 'candidates' | 'masters') => {
    setOpenSection(prev => prev === section ? null : section);
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex items-center gap-2 p-6 border-b border-gray-200">
        <Building2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          RecruitPro
        </span>
      </div>
      
      <div className="p-4 space-y-2">
        <NavItem 
          to="/dashboard" 
          icon={<LayoutDashboard />} 
          text="Dashboard" 
          isActive={isActive('/dashboard')} 
        />

        {can('read', 'jobs') && (
          <NavItem 
            to="/jobs" 
            icon={<Briefcase />} 
            text="Jobs" 
            isActive={isActive('/jobs')} 
          />
        )}

        {can('read', 'team') && (
          <NavItem 
            to="/team" 
            icon={<Users />} 
            text="Team" 
            isActive={isActive('/team')} 
          />
        )}

        {can('read', 'candidates') && (
          <div>
            <div 
              className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                isCandidatesActive ? 'text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => toggleSection('candidates')}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Candidates</span>
              </div>
              <ChevronDown 
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  openSection === 'candidates' ? 'rotate-180' : ''
                }`} 
              />
            </div>
            {openSection === 'candidates' && (
              <div className="pl-4 space-y-2">
                <NavItem 
                  to="/candidates/all" 
                  text="All Candidates" 
                  icon={<Users />} 
                  isActive={isActive('/candidates/all')}
                  isSubItem 
                />
                <NavItem 
                  to="/candidates/my-candidates" 
                  text="My Candidates" 
                  icon={<Users />} 
                  isActive={isActive('/candidates/my-candidates')}
                  isSubItem 
                />
              </div>
            )}
          </div>
        )}

        {can('read', 'masters') && (
          <div>
            <div 
              className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                isMastersActive ? 'text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => toggleSection('masters')}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Masters</span>
              </div>
              <ChevronDown 
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  openSection === 'masters' ? 'rotate-180' : ''
                }`} 
              />
            </div>
            {openSection === 'masters' && (
              <div className="pl-4 space-y-2">
                <NavItem 
                  to="/masters/roles" 
                  text="Roles" 
                  icon={<Shield />} 
                  isActive={isActive('/masters/roles')}
                  isSubItem 
                />
                <NavItem 
                  to="/masters/settings" 
                  text="Settings" 
                  icon={<Settings />} 
                  isActive={isActive('/masters/settings')}
                  isSubItem 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
