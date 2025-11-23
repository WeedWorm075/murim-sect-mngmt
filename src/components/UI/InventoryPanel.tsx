import React from 'react';
import { EquipmentSlot } from './EquipmentSlot';
import { ItemCard } from './ItemCard';
import type { Player } from '../../types/gameTypes';

interface InventoryPanelProps {
  player: Player;
  equipItem: (item: any) => void;
  usePill: (item: any) => void;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ 
  player, 
  equipItem, 
  usePill 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">📦 Inventaire</h2>
      
      {/* Équipement */}
      <div className="bg-white p-4 rounded-lg border-2 border-amber-400">
        <h3 className="font-bold text-amber-900 mb-3">⚔️ Équipement</h3>
        <div className="grid grid-cols-3 gap-4">
          <EquipmentSlot 
            slot="weapon" 
            item={player.equipment.weapon} 
            label="Arme" 
          />
          <EquipmentSlot 
            slot="armor" 
            item={player.equipment.armor} 
            label="Armure" 
          />
          <EquipmentSlot 
            slot="accessory" 
            item={player.equipment.accessory} 
            label="Accessoire" 
          />
        </div>
      </div>

      {/* Items */}
      {player.inventory.length === 0 ? (
        <p className="text-amber-700">Inventaire vide</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {player.inventory.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              equipItem={equipItem}
              usePill={usePill}
            />
          ))}
        </div>
      )}
    </div>
  );
};