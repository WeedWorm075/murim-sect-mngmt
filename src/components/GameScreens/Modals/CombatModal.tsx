import React from 'react';
import type { Technique } from '../../../types/gameTypes';

interface CombatModalProps {
  gameState: any;
  playerAttack: (technique: Technique) => void;
}

export const CombatModal: React.FC<CombatModalProps> = ({ 
  gameState, 
  playerAttack 
}) => {
  if (!gameState.inCombat || !gameState.enemy) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-red-900 to-orange-900 p-8 rounded-lg border-4 border-yellow-500 max-w-4xl w-full shadow-2xl">
        <h2 className="text-3xl font-bold text-yellow-200 mb-6 text-center">⚔️ Combat!</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Player Stats */}
          <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg border-2 border-blue-400">
            <h3 className="text-xl font-bold text-blue-200 mb-3">Vous</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Santé</span>
                  <span>{gameState.player.health}/{gameState.player.maxHealth}</span>
                </div>
                <div className="w-full bg-red-900 rounded-full h-3">
                  <div 
                    className="bg-red-400 h-3 rounded-full transition-all"
                    style={{ width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Qi</span>
                  <span>{gameState.player.qi}/{gameState.player.maxQi}</span>
                </div>
                <div className="w-full bg-blue-900 rounded-full h-3">
                  <div 
                    className="bg-blue-400 h-3 rounded-full transition-all"
                    style={{ width: `${(gameState.player.qi / gameState.player.maxQi) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enemy Stats */}
          <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg border-2 border-red-400">
            <h3 className="text-xl font-bold text-red-200 mb-3">{gameState.enemy.name}</h3>
            <div>
              <div className="flex justify-between text-xs text-red-200 mb-1">
                <span>Santé</span>
                <span>{gameState.enemy.health}/{gameState.enemy.maxHealth}</span>
              </div>
              <div className="w-full bg-red-900 rounded-full h-3">
                <div 
                  className="bg-red-400 h-3 rounded-full transition-all"
                  style={{ width: `${(gameState.enemy.health / gameState.enemy.maxHealth) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Combat Log */}
        <div className="bg-black bg-opacity-40 p-4 rounded-lg mb-6 h-32 overflow-y-auto">
          {gameState.combatLog.map((log: string, idx: number) => (
            <p key={idx} className="text-yellow-100 text-sm mb-1">{log}</p>
          ))}
        </div>

        {/* Techniques */}
        <div className="grid grid-cols-3 gap-3">
          {gameState.player.techniques.map((tech: Technique, idx: number) => (
            <button 
              key={idx} 
              onClick={() => playerAttack(tech)} 
              disabled={gameState.player.qi < tech.qiCost}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 px-4 rounded-lg font-bold hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {tech.name}
              <div className="text-xs">{tech.qiCost} Qi</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};