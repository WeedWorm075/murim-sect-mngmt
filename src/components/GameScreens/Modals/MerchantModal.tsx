import React from 'react';
import type { InventoryItem } from '@/types/gameTypes';
import { merchantItems } from '@/data/merchantItems';

interface MerchantModalProps {
  gameState: any;
  onBuyItem: (item: InventoryItem) => void;
  onClose: () => void;
}

export const MerchantModal: React.FC<MerchantModalProps> = ({
  gameState,
  onBuyItem,
  onClose
}) => {
  const availableItems = merchantItems.filter(item => 
    item.minLevel <= (gameState.inRun ? gameState.runLevel : gameState.player.cultivationLevel)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-6 rounded-lg border-4 border-yellow-500 max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-yellow-900 mb-4">🏪 Marchand Itinérant</h2>
        
        <div className="mb-4 p-4 bg-white rounded-lg border-2 border-yellow-400">
          <div className="flex justify-between text-sm">
            <span className="text-yellow-800">Votre or: <strong>{gameState.sect.gold}💰</strong></span>
            <span className="text-purple-800">Votre Qi: <strong>{gameState.sect.spiritualQi}✨</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {availableItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg border-2 border-amber-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-amber-900">{item.name}</h3>
                <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded">
                  {item.cost} {item.currency === 'gold' ? '💰' : '✨'}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{item.description}</p>
              <button
                onClick={() => onBuyItem(item)}
                disabled={
                  (item.currency === 'gold' && gameState.sect.gold < item.cost) ||
                  (item.currency === 'qi' && gameState.sect.spiritualQi < item.cost)
                }
                className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Acheter
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-all"
        >
          Quitter la boutique
        </button>
      </div>
    </div>
  );
};