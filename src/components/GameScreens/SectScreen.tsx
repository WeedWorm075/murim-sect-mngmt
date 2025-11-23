import React from 'react';
import { Users } from 'lucide-react';
import { BuildingCard } from '../UI/BuildingCard';
import { SectStats } from '../UI/SectStats';

interface SectScreenProps {
  gameState: any;
  upgradeBuilding: (buildingKey: string) => void;
}

export const SectScreen: React.FC<SectScreenProps> = ({ 
  gameState, 
  upgradeBuilding 
}) => {
  return (
    <div className="space-y-6">
      <SectStats sect={gameState.sect} />

      {gameState.sect.buildingQueue.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-400 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-orange-900 mb-2">🔨 En construction</h3>
          {gameState.sect.buildingQueue.map((item: any, idx: number) => (
            <div key={idx} className="bg-white p-2 rounded mb-2 flex justify-between text-sm">
              <span className="font-semibold">{item.name}</span>
              <span className="text-orange-700">{item.daysRemaining}j</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-emerald-900">Bâtiments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(gameState.sect.buildings).map(([key, level]) => (
          <BuildingCard
            key={key}
            buildingKey={key}
            level={level as number}
            upgradeBuilding={upgradeBuilding}
            buildingQueue={gameState.sect.buildingQueue}
            sectResources={gameState.sect}
          />
        ))}
      </div>
    </div>
  );
};