import React from 'react';
import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User, UserPlus, MoreVertical } from 'lucide-react';
import type { User as UserType } from '../types';

interface OrgChartProps {
  users: UserType[];
  onAddMember: (managerId: string) => void;
}

const UserCard: React.FC<{ 
  user: UserType; 
  onAddSubordinate: () => void; 
  subordinatesCount: number 
}> = ({ user, onAddSubordinate, subordinatesCount }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: user.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-white border rounded-lg shadow-sm p-4 mb-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <Link 
              to={`/team/${user.id}`} 
              className="font-semibold text-gray-800 hover:text-indigo-600 transition"
            >
              {user.name}
            </Link>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onAddSubordinate}
            className="text-gray-500 hover:text-indigo-600 transition"
            title="Add Team Member"
          >
            <UserPlus className="w-5 h-5" />
          </button>
          <button 
            className="text-gray-500 hover:text-indigo-600 transition"
            title="More Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div {...attributes} {...listeners} className="cursor-move mt-2 text-xs text-gray-500">
        Drag to reassign reporting structure
      </div>
      {subordinatesCount > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {subordinatesCount} direct report{subordinatesCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default function OrgChart({ users, onAddMember }: OrgChartProps) {
  // Organize users into a hierarchical structure
  const userMap = new Map(users.map(user => [user.id, user]));
  const rootUsers = users.filter(user => !user.reportsTo);
  
  const renderUserHierarchy = (user: UserType) => {
    // Find subordinates
    const subordinates = users.filter(u => u.reportsTo === user.id);
    
    return (
      <div key={user.id} className="pl-4 border-l-2 border-gray-200">
        <UserCard 
          user={user} 
          onAddSubordinate={() => onAddMember(user.id)}
          subordinatesCount={subordinates.length}
        />
        {subordinates.length > 0 && (
          <div className="ml-4">
            {subordinates.map(renderUserHierarchy)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {rootUsers.map(renderUserHierarchy)}
    </div>
  );
}
