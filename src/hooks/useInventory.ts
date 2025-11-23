import type { GameState, Item } from '../types/gameTypes';

export const useInventory = (gameState: GameState, setGameState: any, showNotification: any) => {
  const equipItem = (item: Item) => {
    if (item.type === 'pill') return;
    
    setGameState((prev: GameState) => {
      const equipped = prev.player.equipment[item.type];
      const newInventory = prev.player.inventory.filter(i => i.id !== item.id);
      
      if (equipped) newInventory.push(equipped);
      
      return {
        ...prev,
        player: {
          ...prev.player,
          equipment: { ...prev.player.equipment, [item.type]: item },
          inventory: newInventory,
          attack: prev.player.attack + (item.attack || 0) - (equipped?.attack || 0),
          defense: prev.player.defense + (item.defense || 0) - (equipped?.defense || 0)
        }
      };
    });
    
    showNotification(`${item.name} équipé!`, "success");
  };

  const usePill = (pill: Item) => {
    setGameState((prev: GameState) => {
      const newInventory = prev.player.inventory.filter(i => i.id !== pill.id);
      const updates: any = { inventory: newInventory };
      
      if (pill.effect === 'health') {
        updates.health = Math.min(prev.player.health + 50, prev.player.maxHealth);
      } else if (pill.effect === 'qi') {
        updates.qi = Math.min(prev.player.qi + 50, prev.player.maxQi);
      } else if (pill.effect === 'stats') {
        updates.attack = prev.player.attack + 5;
        updates.defense = prev.player.defense + 5;
      } else if (pill.effect === 'cultivation') {
        updates.cultivationProgress = prev.player.cultivationProgress + 100;
      }
      
      return {
        ...prev,
        player: { ...prev.player, ...updates }
      };
    });
    
    showNotification(`${pill.name} utilisé!`, "success");
  };

  return {
    equipItem,
    usePill
  };
};