import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Settings } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import type { Column } from '../types';

interface TrackerColumnProps {
  column: Column;
  onColorChange: (id: string, color: string) => void;
  onDelete: (id: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

export default function TrackerColumn({
  column,
  onColorChange,
  onDelete,
  onTitleChange
}: TrackerColumnProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div {...listeners} className="cursor-move p-1">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: column.color }}
              />
            </button>
            <button
              onClick={() => onDelete(column.id)}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <input
            type="text"
            value={column.title}
            onChange={(e) => onTitleChange(column.id, e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="font-medium text-gray-900 cursor-pointer"
          >
            {column.title}
          </div>
        )}

        {showColorPicker && (
          <div className="absolute mt-2 z-50">
            <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
            <div className="relative">
              <HexColorPicker
                color={column.color}
                onChange={(color) => onColorChange(column.id, color)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
