import React from 'react';
import { buildings } from '../../data/buildings';
import type { Sect } from '../../types/gameTypes';

interface BuildingCardProps {
  buildingKey: string;
  level: number;
  upgradeBuilding: (buildingKey: string) => void;
  buildingQueue: any[];
  sectResources: Sect;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ 
  buildingKey, 
  level, 
  upgradeBuilding, 
  buildingQueue, 
  sectResources 
}) => {
  const building = buildings[buildingKey];
  const inQueue = buildingQueue.some(item => item.building === buildingKey);

  return (
    <div className="bg-gradient-to-br from-stone-100 to-slate-100 p-4 rounded-lg border-2 border-stone-400 shadow-lg">
      <h3 className="text-lg font-bold text-stone-800 mb-1">{building.name}</h3>
      <p className="text-xs text-stone-600 mb-1">Niv.{level} | {building.effect}</p>
      <p className="text-xs text-orange-600 mb-3">⏰ {building.buildTime}j</p>
      <button 
        onClick={() => upgradeBuilding(buildingKey)} 
        disabled={inQueue || sectResources.gold < building.cost || sectResources.spiritualQi < building.qiCost}
        className="w-full bg-emerald-600 text-white py-2 rounded font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
      >
        {inQueue ? '🔨 En cours...' : `Améliorer (${building.cost}💰 ${building.qiCost}✨)`}
      </button>
    </div>
  );
};