import React from 'react';
import { Sparkles, Swords, Leaf, Map, Home } from 'lucide-react';
import { PlayerStats } from '../UI/PlayerStats';
import { SectStats } from '../UI/SectStats';

interface HomeScreenProps {
  gameState: any;
  cultivate: () => void;
  rest: () => void;
  startRun: () => void;
  setView: (view: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  gameState, 
  cultivate, 
  rest, 
  startRun, 
  setView 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlayerStats player={gameState.player} />
        
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg border-2 border-red-600 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-red-900">Combat</h3>
            <Swords className="text-red-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="flex justify-between text-xs text-red-700 mb-1">
                <span>Santé</span>
                <span>{gameState.player.health}/{gameState.player.maxHealth}</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-blue-700 mb-1">
                <span>Qi</span>
                <span>{gameState.player.qi}/{gameState.player.maxQi}</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(gameState.player.qi / gameState.player.maxQi) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectStats sect={gameState.sect} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={cultivate} 
          disabled={gameState.sect.spiritualQi < 20 || gameState.actionsRemaining <= 0}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          <Sparkles className="inline mr-2" size={20} />Cultiver
        </button>
        
        <button 
          onClick={rest} 
          disabled={gameState.actionsRemaining <= 0}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          <Leaf className="inline mr-2" size={20} />Repos
        </button>
        
        <button 
          onClick={startRun} 
          disabled={gameState.actionsRemaining <= 0}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-lg font-bold hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          <Map className="inline mr-2" size={20} />Run (9 niveaux)
        </button>
        
        <div className="bg-gradient-to-r from-slate-700 to-gray-700 text-white p-4 rounded-lg font-bold shadow-lg text-center">
          <div className="text-2xl">{gameState.actionsRemaining}/3</div>
          <div className="text-xs mt-1">Actions | Jour {gameState.day}</div>
        </div>
      </div>
    </div>
  );
};