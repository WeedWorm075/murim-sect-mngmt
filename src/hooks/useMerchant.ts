import type { GameState, InventoryItem } from '../types/gameTypes';
import { merchantItems } from '../data/merchantItems';

export const useMerchant = (gameState: GameState, setGameState: any, showNotification: any) => {
  const buyItem = (item: InventoryItem) => {
    const merchantItem = merchantItems.find(mi => mi.id === item.id);
    if (!merchantItem) return false;

    const hasEnoughGold = merchantItem.currency === 'gold' && gameState.sect.gold >= merchantItem.cost;
    const hasEnoughQi = merchantItem.currency === 'qi' && gameState.sect.spiritualQi >= merchantItem.cost;

    if (!hasEnoughGold && !hasEnoughQi) {
      showNotification(`Pas assez de ${merchantItem.currency === 'gold' ? 'or' : 'Qi'}!`, "error");
      return false;
    }

    setGameState((prev: GameState) => {
      const newItem = { ...item };
      delete newItem.cost;
      delete newItem.currency;
      delete newItem.minLevel;

      return {
        ...prev,
        player: {
          ...prev.player,
          inventory: [...prev.player.inventory, newItem]
        },
        sect: {
          ...prev.sect,
          gold: merchantItem.currency === 'gold' ? prev.sect.gold - merchantItem.cost : prev.sect.gold,
          spiritualQi: merchantItem.currency === 'qi' ? prev.sect.spiritualQi - merchantItem.cost : prev.sect.spiritualQi
        }
      };
    });

    showNotification(`${item.name} acheté!`, "success");
    return true;
  };

  const sellItem = (item: InventoryItem) => {
    const sellPrice = getSellPrice(item);

    setGameState((prev: GameState) => {
      // Remove from inventory
      const newInventory = prev.player.inventory.filter(invItem => invItem.id !== item.id);
      
      // Remove from equipment if equipped
      let newEquipment = { ...prev.player.equipment };
      let statChanges = { attack: 0, defense: 0 };

      Object.keys(newEquipment).forEach(slot => {
        if (newEquipment[slot]?.id === item.id) {
          // Subtract equipment stats
          if (item.attack) statChanges.attack -= item.attack;
          if (item.defense) statChanges.defense -= item.defense;
          newEquipment[slot] = null;
        }
      });

      return {
        ...prev,
        player: {
          ...prev.player,
          inventory: newInventory,
          equipment: newEquipment,
          attack: prev.player.attack + statChanges.attack,
          defense: prev.player.defense + statChanges.defense
        },
        sect: {
          ...prev.sect,
          gold: prev.sect.gold + sellPrice
        }
      };
    });

    showNotification(`${item.name} vendu pour ${sellPrice}💰`, "success");
  };

  const getSellPrice = (item: InventoryItem) => {
    const basePrice = 50;
    const gradeMultiplier = {
      human: 1,
      earth: 2,
      heaven: 4,
      immortal: 8
    }[item.grade || 'human'];
    
    // Additional value for equipment stats
    const statBonus = (item.attack || 0) * 5 + (item.defense || 0) * 3;
    
    return Math.floor((basePrice + statBonus) * gradeMultiplier);
  };

  const getAvailableItems = () => {
    return merchantItems.filter(item => 
      item.minLevel <= (gameState.inRun ? gameState.runLevel : gameState.player.cultivationLevel)
    );
  };

  return {
    buyItem,
    sellItem,
    getSellPrice,
    getAvailableItems
  };
};