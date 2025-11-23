import React from 'react';
import { itemGrades } from '../../data/itemGrades';
import type { Item } from '../../types/gameTypes';

interface ItemCardProps {
  item: Item;
  equipItem: (item: Item) => void;
  usePill: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  equipItem, 
  usePill 
}) => {
  const gradeInfo = itemGrades[item.grade];

  return (
    <div className={`${gradeInfo.bg} p-4 rounded-lg border-2 ${gradeInfo.border}`}>
      <p className={`font-bold text-sm ${gradeInfo.color}`}>{item.name}</p>
      <p className="text-xs text-gray-700 mb-2">{item.description}</p>
      {item.type === 'pill' ? (
        <button 
          onClick={() => usePill(item)}
          className="w-full bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600"
        >
          Utiliser
        </button>
      ) : (
        <button 
          onClick={() => equipItem(item)}
          className="w-full bg-blue-500 text-white text-xs py-1 rounded hover:bg-blue-600"
        >
          Équiper
        </button>
      )}
    </div>
  );
};