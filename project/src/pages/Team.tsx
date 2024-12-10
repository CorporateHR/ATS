import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Users, UserPlus } from 'lucide-react';
import type { User } from '../types';
import AddTeamMemberModal from '../components/AddTeamMemberModal';
import OrgChart from '../components/OrgChart';

const MOCK_TEAM: User[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@recruitpro.com',
    mobile: '+1 (555) 123-4567',
    role: 'admin',
    reportsTo: '',
    agencyId: 'agency1'
  },
  {
    id: '2',
    name: 'Mike Thompson',
    email: 'mike@recruitpro.com',
    mobile: '+1 (555) 234-5678',
    role: 'manager',
    reportsTo: '1',
    agencyId: 'agency1'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@recruitpro.com',
    mobile: '+1 (555) 345-6789',
    role: 'recruiter',
    reportsTo: '2',
    agencyId: 'agency1'
  }
];

export default function Team() {
  const [team, setTeam] = useState<User[]>(MOCK_TEAM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<string>('');

  const handleAddMember = (newMember: Omit<User, 'id'>) => {
    const member = {
      ...newMember,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTeam([...team, member]);
    setIsModalOpen(false);
    setSelectedManager('');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    setTeam(team.map(member => {
      if (member.id === active.id) {
        return { ...member, reportsTo: over.id as string };
      }
      return member;
    }));
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600">Manage your recruitment team structure</p>
        </div>
        <button 
          onClick={() => {
            setSelectedManager('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add Team Member
        </button>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={team.map(user => user.id)}
            strategy={verticalListSortingStrategy}
          >
            <OrgChart
              users={team}
              onAddMember={(managerId) => {
                setSelectedManager(managerId);
                setIsModalOpen(true);
              }}
            />
          </SortableContext>
        </DndContext>
      </div>

      <AddTeamMemberModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedManager('');
        }}
        onAdd={handleAddMember}
        teamMembers={team}
        preselectedManager={selectedManager}
      />
    </div>
  );
}
