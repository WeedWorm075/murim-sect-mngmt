import React from 'react';
import { locations } from '../../data/locations';
import { LocationCard } from '../UI/LocationCard';

interface MapScreenProps {
  gameState: any;
  selectLocation: (location: any) => void;
  setView: (view: string) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ 
  gameState, 
  selectLocation, 
  setView 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-amber-900 text-center mb-6">🗺️ Exploration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map(loc => (
          <LocationCard
            key={loc.id}
            location={loc}
            selectLocation={selectLocation}
            actionsRemaining={gameState.actionsRemaining}
          />
        ))}
      </div>
      <button 
        onClick={() => setView('home')}
        className="w-full bg-gradient-to-r from-stone-600 to-slate-600 text-white py-3 rounded-lg font-bold hover:from-stone-700 hover:to-slate-700 transition-all shadow-lg"
      >
        ← Retour
      </button>
    </div>
  );
};