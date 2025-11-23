import React from 'react';
import type { InventoryItem } from '../../../types/gameTypes';

interface CombatConsumablesProps {
  inventory: InventoryItem[];
  usePill: (pill: InventoryItem) => void;
  playerHealth: number;
  maxHealth: number;
  playerQi: number;
  maxQi: number;
}

export const CombatConsumables: React.FC<CombatConsumablesProps> = ({
  inventory,
  usePill,
  playerHealth,
  maxHealth,
  playerQi,
  maxQi
}) => {
  const pills = inventory.filter(item => item.type === 'pill');

  if (pills.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-purple-900 bg-opacity-50 rounded-lg border-2 border-purple-400">
      <h3 className="text-lg font-bold text-purple-200 mb-3">💊 Consommables</h3>
      <div className="grid grid-cols-2 gap-2">
        {pills.map(pill => (
          <button
            key={pill.id}
            onClick={() => usePill(pill)}
            disabled={
              (pill.effect === 'health' && playerHealth >= maxHealth) ||
              (pill.effect === 'qi' && playerQi >= maxQi)
            }
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded text-sm hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {pill.name}
            <div className="text-xs opacity-80">{pill.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};