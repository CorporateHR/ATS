import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Undo2, Redo2, Share2, Download, Save, Table } from 'lucide-react';
import TrackerColumn from './TrackerColumn';
import AssignmentDropdown from './AssignmentDropdown';
import type { Column } from '../types';

interface TrackerAssignment {
  type: 'job' | 'spoc' | 'client';
  id: string;
}

const AVAILABLE_COLUMNS = [
  {
    id: 'name',
    title: 'Full Name',
    type: 'text'
  },
  {
    id: 'email',
    title: 'Email',
    type: 'text'
  },
  {
    id: 'phone',
    title: 'Phone',
    type: 'text'
  },
  {
    id: 'current_company',
    title: 'Current Company',
    type: 'text'
  },
  {
    id: 'current_designation',
    title: 'Current Designation',
    type: 'text'
  },
  {
    id: 'experience',
    title: 'Experience (Years)',
    type: 'number'
  },
  {
    id: 'skills',
    title: 'Skills',
    type: 'tags'
  },
  {
    id: 'status',
    title: 'Application Status',
    type: 'select',
    options: ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']
  },
  {
    id: 'resume_url',
    title: 'Resume',
    type: 'file'
  },
  {
    id: 'appliedDate',
    title: 'Applied Date',
    type: 'date'
  }
];

export default function TalentTracker() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedSpoc, setSelectedSpoc] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [trackerName, setTrackerName] = useState<string>('');
  const [assignments, setAssignments] = useState<TrackerAssignment[]>([]);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState('');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleColorChange = (columnId: string, color: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, color } : col
    ));
  };

  const handleAddColumn = () => {
    if (!selectedColumnId) return;

    const columnToAdd = AVAILABLE_COLUMNS.find(col => col.id === selectedColumnId);
    if (!columnToAdd) return;

    const newColumn: Column = {
      id: Math.random().toString(36).substr(2, 9),
      title: columnToAdd.title,
      color: '#6B7280',
      type: columnToAdd.type,
      ...(columnToAdd.options && { options: columnToAdd.options })
    };
    
    setColumns([...columns, newColumn]);
    setShowAddColumn(false);
    setSelectedColumnId('');
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const handleTitleChange = (columnId: string, title: string) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, title } : col
    ));
  };

  const handleAssign = (type: 'job' | 'spoc' | 'client') => {
    let id = '';
    switch (type) {
      case 'job':
        id = selectedJob;
        break;
      case 'spoc':
        id = selectedSpoc;
        break;
      case 'client':
        id = selectedClient;
        break;
    }

    if (id) {
      setAssignments(prev => [...prev, { type, id }]);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving tracker:', {
      name: trackerName,
      columns,
      assignments
    });
  };

  // Get available columns that haven't been added yet
  const remainingColumns = AVAILABLE_COLUMNS.filter(
    availableCol => !columns.some(col => col.title === availableCol.title)
  );

  if (columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow">
        <Table className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Columns Added Yet</h3>
        <p className="text-gray-500 mb-4">Start by adding columns to track candidate information</p>
        {showAddColumn ? (
          <div className="w-full max-w-md space-y-4">
            <select
              value={selectedColumnId}
              onChange={(e) => setSelectedColumnId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a column to add</option>
              {AVAILABLE_COLUMNS.map(col => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddColumn(false);
                  setSelectedColumnId('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColumn}
                disabled={!selectedColumnId}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Column
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddColumn(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Column
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={trackerName}
            onChange={(e) => setTrackerName(e.target.value)}
            placeholder="Enter tracker name"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Undo2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Redo2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {showAddColumn ? (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-medium">Add New Column</h3>
          <div className="space-y-4">
            <select
              value={selectedColumnId}
              onChange={(e) => setSelectedColumnId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a column to add</option>
              {remainingColumns.map(col => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddColumn(false);
                  setSelectedColumnId('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColumn}
                disabled={!selectedColumnId}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddColumn(true)}
          disabled={remainingColumns.length === 0}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Column
        </button>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex items-start space-x-4 overflow-x-auto pb-4">
          <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
            {columns.map((column) => (
              <TrackerColumn
                key={column.id}
                column={column}
                onColorChange={(color) => handleColorChange(column.id, color)}
                onDelete={() => handleDeleteColumn(column.id)}
                onTitleChange={(title) => handleTitleChange(column.id, title)}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      <div className="grid grid-cols-3 gap-4">
        <AssignmentDropdown
          type="job"
          selectedId={selectedJob}
          onSelect={setSelectedJob}
          onAssign={() => handleAssign('job')}
        />
        <AssignmentDropdown
          type="spoc"
          selectedId={selectedSpoc}
          onSelect={setSelectedSpoc}
          onAssign={() => handleAssign('spoc')}
        />
        <AssignmentDropdown
          type="client"
          selectedId={selectedClient}
          onSelect={setSelectedClient}
          onAssign={() => handleAssign('client')}
        />
      </div>
    </div>
  );
}
