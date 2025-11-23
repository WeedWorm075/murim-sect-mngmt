import React from 'react';
import { itemGrades } from '../../../data/itemGrades';
import type { Technique } from '../../../types/gameTypes';

interface TechniqueSelectionModalProps {
  showTechniqueSelection: Technique | null;
  playerTechniques: Technique[];
  maxTechniques: number;
  replaceTechnique: (oldTech: Technique) => void;
  closeModal: () => void;
}

export const TechniqueSelectionModal: React.FC<TechniqueSelectionModalProps> = ({ 
  showTechniqueSelection, 
  playerTechniques, 
  maxTechniques,
  replaceTechnique, 
  closeModal 
}) => {
  if (!showTechniqueSelection) return null;

  const gradeInfo = itemGrades[showTechniqueSelection.grade];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-lg border-4 border-purple-600 max-w-3xl w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-900 mb-4 text-center">
          📜 Nouvelle Technique Trouvée!
        </h2>
        
        <div className={`${gradeInfo.bg} p-4 rounded-lg border-2 ${gradeInfo.border} mb-6`}>
          <p className={`font-bold text-lg ${gradeInfo.color}`}>
            {showTechniqueSelection.name}
          </p>
          <p className="text-sm mt-2">Dégâts: {showTechniqueSelection.damage} | Qi: {showTechniqueSelection.qiCost}</p>
          <p className="text-sm">Apprentissage: {showTechniqueSelection.learnTime} jours</p>
        </div>

        <p className="text-center text-purple-900 font-semibold mb-4">
          Vos techniques sont pleines ({playerTechniques.length}/{maxTechniques}). Choisissez une technique à remplacer:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {playerTechniques.map((tech) => (
            <button
              key={tech.name}
              onClick={() => replaceTechnique(tech)}
              className="bg-white p-3 rounded-lg border-2 border-purple-400 hover:bg-purple-50 transition-all text-left"
            >
              <p className="font-bold text-sm text-purple-900">{tech.name}</p>
              <p className="text-xs text-gray-600">Dégâts: {tech.damage || 0} | Qi: {tech.qiCost}</p>
            </button>
          ))}
        </div>

        <button
          onClick={closeModal}
          className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};