import { cultivationLevels } from '../data/cultivationLevels';
import type { GameState } from '../types/gameTypes';

export const useCultivation = (gameState: GameState, setGameState: any, useAction: any, showNotification: any) => {
  const cultivate = () => {
    if (gameState.sect.spiritualQi < 20 || gameState.actionsRemaining <= 0) return;
    
    const currentStage = cultivationLevels.findIndex(l => l.name === gameState.player.cultivation);
    const stage = cultivationLevels[currentStage];
    const gain = 10 + (gameState.sect.buildings.cultivationHall * 5);

    setGameState((prev: GameState) => {
      const newProgress = prev.player.cultivationProgress + gain;
      const currentLevel = prev.player.cultivationLevel;
      
      if (newProgress >= stage.progressPerLevel) {
        if (currentLevel < stage.maxLevel) {
          showNotification(`Niveau ${currentLevel + 1}!`, "success");
          useAction();
          return {
            ...prev,
            player: {
              ...prev.player,
              cultivationLevel: currentLevel + 1,
              cultivationProgress: newProgress - stage.progressPerLevel,
              maxQi: prev.player.maxQi + 10,
              qi: prev.player.maxQi + 10,
              maxHealth: prev.player.maxHealth + 10,
              health: prev.player.maxHealth + 10,
              attack: prev.player.attack + 2,
              defense: prev.player.defense + 1
            },
            sect: { ...prev.sect, spiritualQi: prev.sect.spiritualQi - 20 }
          };
        } else if (currentStage < cultivationLevels.length - 1) {
          const nextStage = cultivationLevels[currentStage + 1];
          showNotification(`${nextStage.name}!`, "breakthrough");
          useAction();
          return {
            ...prev,
            player: {
              ...prev.player,
              cultivation: nextStage.name,
              cultivationLevel: 1,
              cultivationProgress: 0,
              maxQi: prev.player.maxQi + 50,
              qi: prev.player.maxQi + 50,
              maxHealth: prev.player.maxHealth + 50,
              health: prev.player.maxHealth + 50,
              attack: prev.player.attack + 10,
              defense: prev.player.defense + 5,
              persuasion: prev.player.persuasion + 5,
              stealth: prev.player.stealth + 5
            },
            sect: { ...prev.sect, spiritualQi: prev.sect.spiritualQi - 20 }
          };
        }
      }

      useAction();
      return {
        ...prev,
        player: { ...prev.player, cultivationProgress: newProgress },
        sect: { ...prev.sect, spiritualQi: prev.sect.spiritualQi - 20 }
      };
    });
  };

  const rest = () => {
    if (gameState.actionsRemaining <= 0) return;
    
    setGameState((prev: GameState) => ({
      ...prev,
      player: {
        ...prev.player,
        health: Math.min(prev.player.health + 50, prev.player.maxHealth),
        qi: Math.min(prev.player.qi + 30, prev.player.maxQi)
      }
    }));
    showNotification("Repos", "success");
    useAction();
  };

  return {
    cultivate,
    rest
  };
};