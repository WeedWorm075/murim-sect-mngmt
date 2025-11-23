import React from 'react';
import type { Location } from '../../types/gameTypes';

interface LocationCardProps {
  location?: Location | null; // runtime-safe: location peut être absent
  selectLocation: (location: Location) => void;
  actionsRemaining: number;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  selectLocation,
  actionsRemaining,
}) => {
  // Fallbacks lisibles
  const name = location?.name ?? 'Lieu inconnu';
  const icon = location?.icon ?? '❓';
  const firstEnemyName = location?.enemies?.[0]?.name ?? 'Aucun ennemi';

  const disabled = !location || actionsRemaining <= 0;

  return (
    <div
      onClick={() => {
        if (!disabled && location) selectLocation(location);
      }}
      // accessibilité + styles conditionnels
      role="button"
      aria-disabled={disabled}
      className={`bg-gradient-to-br from-stone-100 to-slate-100 p-6 rounded-lg border-2 border-amber-500 shadow-lg transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl hover:scale-105'}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl">{icon}</span>
        <h4 className="text-lg font-bold text-stone-900">{name}</h4>
      </div>
      <p className="text-xs text-stone-700">{firstEnemyName}</p>
    </div>
  );
};
