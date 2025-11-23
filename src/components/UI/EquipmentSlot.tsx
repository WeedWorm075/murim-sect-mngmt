import React from 'react';
import { itemGrades } from '../../data/itemGrades';
import type { Item } from '../../types/gameTypes';

interface EquipmentSlotProps {
  slot: string;
  item: Item | null;
  label: string;
}

export const EquipmentSlot: React.FC<EquipmentSlotProps> = ({ 
  slot, 
  item, 
  label 
}) => {
  return (
    <div className="bg-gray-100 p-3 rounded border-2 border-gray-300 text-center">
      <p className="text-xs text-gray-600 mb-2">{label}</p>
      {item ? (
        <div className={`${itemGrades[item.grade].bg} p-2 rounded`}>
          <p className={`text-xs font-bold ${itemGrades[item.grade].color}`}>{item.name}</p>
          <p className="text-xs">{item.description}</p>
        </div>
      ) : (
        <p className="text-gray-400 text-xs">Vide</p>
      )}
    </div>
  );
};