import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Player } from '../../types/gameTypes';
import { cultivationLevels } from '../../data/cultivationLevels';

interface PlayerStatsProps {
  player: Player;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const currentCultivationStage = cultivationLevels.find(l => l.name === player.cultivation);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-600 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-amber-900">Profil</h3>
        <Sparkles className="text-amber-600" />
      </div>
      <div className="space-y-2 text-sm">
        <p className="text-amber-800">
          <strong>Cultivation:</strong> {player.cultivation} Niv.{player.cultivationLevel}/9
        </p>
        <p className="text-amber-800">
          <strong>ATK:</strong> {player.attack} | <strong>DEF:</strong> {player.defense}
        </p>
        <p className="text-amber-800">
          <strong>Persuasion:</strong> {player.persuasion} | <strong>Discrétion:</strong> {player.stealth}
        </p>
        <div className="mt-2">
          <div className="flex justify-between text-xs text-amber-700 mb-1">
            <span>Progression</span>
            <span>{player.cultivationProgress}/{currentCultivationStage!.progressPerLevel}</span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(player.cultivationProgress / currentCultivationStage!.progressPerLevel) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};