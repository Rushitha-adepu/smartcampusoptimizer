
import React from 'react';
import { CrowdLevel, PredictionResult } from '../types';

interface PredictionIndicatorProps {
  prediction: PredictionResult | null;
  loading?: boolean;
}

const PredictionIndicator: React.FC<PredictionIndicatorProps> = ({ prediction, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-50 rounded-xl p-6 border border-dashed border-gray-300">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!prediction) return null;

  const getCrowdColor = (level: CrowdLevel) => {
    switch (level) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressWidth = (level: CrowdLevel) => {
    switch (level) {
      case 'Low': return 'w-1/4';
      case 'Medium': return 'w-2/3';
      case 'High': return 'w-full';
      default: return 'w-0';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-100 transform transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-1 rounded">AI Prediction</span>
        <div className="flex items-center text-xs text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {Math.round(prediction.confidence * 100)}% Confidence
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Crowd Level</p>
          <div className="flex items-center">
            <span className={`text-xl font-bold ${prediction.crowdLevel === 'High' ? 'text-red-600' : prediction.crowdLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
              {prediction.crowdLevel}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Wait Time</p>
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">~{prediction.estimatedWaitMinutes} mins</span>
          </div>
        </div>
      </div>

      <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
        <div className={`absolute top-0 left-0 h-full transition-all duration-700 ${getCrowdColor(prediction.crowdLevel)} ${getProgressWidth(prediction.crowdLevel)}`}></div>
      </div>
      
      <p className="text-xs text-gray-600 italic">"{prediction.reasoning}"</p>
    </div>
  );
};

export default PredictionIndicator;
