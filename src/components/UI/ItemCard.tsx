import React from 'react';
import { itemGrades } from '../../data/itemGrades';
import type { Item } from '../../types/gameTypes';

interface ItemCardProps {
  item?: Item | null; // runtime-safe: on accepte item undefined/null
  equipItem: (item: Item) => void;
  usePill: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  equipItem,
  usePill,
}) => {
  // Fallback si item absent
  if (!item) {
    return (
      <div className="p-4 rounded-lg border-2 border-gray-300 bg-white text-sm text-gray-700">
        Objet inconnu
      </div>
    );
  }

  // Défaut au cas où le grade n'existe pas dans itemGrades
  const defaultGrade = {
    color: 'text-gray-900',
    bg: 'bg-white',
    border: 'border-gray-300',
  };

  const gradeInfo = (item.grade && itemGrades[item.grade]) ? itemGrades[item.grade] : defaultGrade;

  const isPill = item.type === 'pill';

  return (
    <div className={`${gradeInfo.bg} p-4 rounded-lg border-2 ${gradeInfo.border}`}>
      <p className={`font-bold text-sm ${gradeInfo.color}`}>{item.name}</p>
      <p className="text-xs text-gray-700 mb-2">{item.description}</p>

      {isPill ? (
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
