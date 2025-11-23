import React, { useState } from 'react';
import type { Technique } from '../../../types/gameTypes';

interface TechniqueLearningModalProps {
  technique: Technique;
  currentProgress: number;
  requiredProgress: number;
  onPractice: (success: boolean) => void;
  onClose: () => void;
}

export const TechniqueLearningModal: React.FC<TechniqueLearningModalProps> = ({
  technique,
  currentProgress,
  requiredProgress,
  onPractice,
  onClose
}) => {
  const [practiceType, setPracticeType] = useState<'meditation' | 'sparring' | 'insight' | null>(null);

  const practiceMethods = {
    meditation: { name: "Méditation", cost: 10, successRate: 0.7, progress: 15 },
    sparring: { name: "Sparring", cost: 20, successRate: 0.5, progress: 25 },
    insight: { name: "Illumination", cost: 30, successRate: 0.3, progress: 40 }
  };

  const handlePractice = (method: keyof typeof practiceMethods) => {
    setPracticeType(method);
    const methodInfo = practiceMethods[method];
    const success = Math.random() < methodInfo.successRate;
    
    setTimeout(() => {
      onPractice(success);
      setPracticeType(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-lg border-4 border-blue-500 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">📜 Apprentissage: {technique.name}</h2>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-blue-800 mb-1">
            <span>Progression</span>
            <span>{currentProgress}/{requiredProgress}</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-4">
            <div 
              className="bg-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${(currentProgress / requiredProgress) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <h3 className="font-bold text-blue-900">Méthodes d'entraînement:</h3>
          {Object.entries(practiceMethods).map(([key, method]) => (
            <button
              key={key}
              onClick={() => handlePractice(key as keyof typeof practiceMethods)}
              disabled={practiceType !== null}
              className="w-full bg-white p-3 rounded-lg border-2 border-blue-300 hover:bg-blue-50 disabled:opacity-50 transition-all text-left"
            >
              <div className="font-semibold text-blue-900">{method.name}</div>
              <div className="text-sm text-blue-700">
                Coût: {method.cost} Qi | Progression: +{method.progress} | Succès: {method.successRate * 100}%
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-all"
        >
          Retour
        </button>
      </div>
    </div>
  );
};