import React from 'react';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import type { RecruitmentStage } from '../types';

interface ProcessStageCardProps {
  stage: RecruitmentStage;
  onEdit: (stage: RecruitmentStage) => void;
  onDelete: (stageId: string) => void;
}

export default function ProcessStageCard({ stage, onEdit, onDelete }: ProcessStageCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="cursor-move">
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{stage.name}</h3>
        <p className="text-sm text-gray-500">{stage.description}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onEdit(stage)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
        <button 
          onClick={() => onDelete(stage.id)}
          className="p-1 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}
