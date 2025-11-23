import React from 'react';
import type { Location } from '../../types/gameTypes';

interface LocationCardProps {
  location: Location;
  selectLocation: (location: Location) => void;
  actionsRemaining: number;
}

export const LocationCard: React.FC<LocationCardProps> = ({ 
  location, 
  selectLocation, 
  actionsRemaining 
}) => {
  return (
    <div 
      onClick={() => actionsRemaining > 0 && selectLocation(location)}
      className={`bg-gradient-to-br from-stone-100 to-slate-100 p-6 rounded-lg border-2 border-amber-500 shadow-lg cursor-pointer hover:shadow-2xl transition-all ${
        actionsRemaining <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl">{location.icon}</span>
        <h4 className="text-lg font-bold text-stone-900">{location.name}</h4>
      </div>
      <p className="text-xs text-stone-700">{location.enemies[0].name}</p>
    </div>
  );
};