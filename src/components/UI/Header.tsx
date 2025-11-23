import React from 'react';
import { Home, Users, Package } from 'lucide-react';

interface HeaderProps {
  gameState: any;
  setView: (view: string) => void;
  toggleInventory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  gameState, 
  setView, 
  toggleInventory 
}) => {
  return (
    <div className="bg-gradient-to-r from-stone-800 to-slate-800 border-x-4 border-yellow-500 shadow-xl">
      <div className="flex flex-wrap justify-center gap-2 p-4">
        <button 
          onClick={() => setView('home')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
            gameState.currentView === 'home'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
              : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
          }`}
        >
          <Home className="inline mr-2" size={18} />Accueil
        </button>
        
        <button 
          onClick={() => setView('sect')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
            gameState.currentView === 'sect'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
              : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
          }`}
        >
          <Users className="inline mr-2" size={18} />Secte
        </button>
        
        <button 
          onClick={toggleInventory}
          className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
            gameState.showInventory
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
              : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
          }`}
        >
          <Package className="inline mr-2" size={18} />Inventaire
        </button>
      </div>
    </div>
  );
};