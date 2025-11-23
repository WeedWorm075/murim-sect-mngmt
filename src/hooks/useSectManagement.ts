import { buildings } from '../data/buildings';
import type { GameState } from '../types/gameTypes';

export const useSectManagement = (gameState: GameState, setGameState: any, showNotification: any) => {
  const upgradeBuilding = (buildingKey: string) => {
    const building = buildings[buildingKey];
    const currentLevel = gameState.sect.buildings[buildingKey as keyof typeof gameState.sect.buildings];

    if (gameState.sect.gold >= building.cost && gameState.sect.spiritualQi >= building.qiCost) {
      setGameState((prev: GameState) => ({
        ...prev,
        sect: {
          ...prev.sect,
          gold: prev.sect.gold - building.cost,
          spiritualQi: prev.sect.spiritualQi - building.qiCost,
          buildingQueue: [
            ...prev.sect.buildingQueue,
            { 
              building: buildingKey, 
              name: building.name, 
              daysRemaining: building.buildTime, 
              targetLevel: currentLevel + 1 
            }
          ]
        }
      }));
      showNotification(`${building.name} (${building.buildTime}j)`, "success");
    }
  };

  return {
    upgradeBuilding
  };
};