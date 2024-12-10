import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import type { RecruitmentStage, CandidateProgress } from '../types';

interface RecruitmentProgressProps {
  stages: RecruitmentStage[];
  currentProgress: CandidateProgress;
}

export default function RecruitmentProgress({ stages, currentProgress }: RecruitmentProgressProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentProgress.currentStage.order > stage.order
                  ? 'bg-green-100 text-green-600'
                  : currentProgress.currentStage.order === stage.order
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {currentProgress.currentStage.order > stage.order ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm text-gray-600 mt-2">{stage.name}</span>
            </div>
            {index < stages.length - 1 && (
              <div className="flex-1 h-px bg-gray-200 mx-4 relative top-4">
                <ArrowRight className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
