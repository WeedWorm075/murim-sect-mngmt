import React from 'react';
import { eventTypes } from '../../../data/eventTypes';

interface RunEventModalProps {
  gameState: any;
  handleEventChoice: (choice: string) => void;
  exitRun: () => void;
}

export const RunEventModal: React.FC<RunEventModalProps> = ({ 
  gameState, 
  handleEventChoice, 
  exitRun 
}) => {
  if (!gameState.inRun || !gameState.currentEvent) return null;

  const event = gameState.currentEvent;
  const eventInfo = eventTypes[event.type];

  const getEventDescription = () => {
    switch (event.type) {
      case 'combat':
        return { title: '⚔️ Un ennemi vous barre la route!', description: 'Préparez-vous au combat...' };
      case 'treasure':
        return { title: '💎 Vous découvrez un trésor!', description: 'Un objet mystérieux brille devant vous...' };
      case 'enlightenment':
        return { title: '✨ Une illumination soudaine!', description: 'Votre compréhension du Dao s\'approfondit...' };
      case 'technique':
        return { title: '📜 Un manuel de technique ancienne!', description: 'Vous découvrez une technique perdue...' };
      case 'merchant':
        return { title: '🏪 Un marchand errant!', description: 'Il propose ses marchandises...' };
      default:
        return { title: '❓ Un événement étrange...', description: 'Quelque chose d\'inattendu se produit...' };
    }
  };

  const { title, description } = getEventDescription();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-8 rounded-lg border-4 border-amber-600 max-w-2xl w-full shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">
            Niveau {gameState.runLevel}/9
          </h2>
          <p className="text-lg text-amber-700">
            {eventInfo.icon} {eventInfo.name}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg mb-6 text-center">
          <p className="text-lg mb-4">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => handleEventChoice('accept')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            {event.type === 'combat' ? 'Combattre' : 'Accepter / Continuer'}
          </button>
          
          {gameState.runLevel < 8 && (
            <button 
              onClick={exitRun}
              className="w-full bg-gradient-to-r from-gray-600 to-slate-600 text-white p-3 rounded-lg font-semibold hover:from-gray-700 hover:to-slate-700 transition-all"
            >
              ← Quitter le Run
            </button>
          )}
        </div>
        
        {gameState.runLevel >= 8 && (
          <p className="text-center text-red-600 text-sm mt-4 font-bold">
            ⚠️ Impossible de quitter après niveau 7
          </p>
        )}
      </div>
    </div>
  );
};