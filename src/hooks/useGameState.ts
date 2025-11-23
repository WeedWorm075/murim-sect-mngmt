import { useState } from 'react';
import type { GameState, Player, Sect } from '../types/gameTypes';
import { cultivationLevels } from '../data/cultivationLevels';
import { baseTechniques } from '../data/techniques';

const initialPlayer: Player = {
  name: "Maître de Secte",
  cultivation: "Qi Gathering",
  cultivationLevel: 1,
  cultivationProgress: 0,
  qi: 100,
  maxQi: 100,
  health: 150,
  maxHealth: 150,
  attack: 20,
  defense: 15,
  persuasion: 50,
  stealth: 30,
  techniques: baseTechniques,
  maxTechniques: 6,
  equipment: { weapon: null, armor: null, accessory: null },
  inventory: [],
  learningTechnique: null
};

const initialSect: Sect = {
  name: "Secte du Lotus Céleste",
  gold: 500,
  spiritualQi: 300,
  reputation: 50,
  disciples: 5,
  region: "centre",
  buildings: {
    cultivationHall: 1,
    library: 1,
    garden: 0,
    forge: 0,
    studyHall: 0
  },
  resources: {
    herbs: 10,
    minerals: 5,
    artifacts: 2,
    scrolls: 3
  },
  defenses: 50,
  morale: 80,
  buildingQueue: []
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    player: initialPlayer,
    sect: initialSect,
    currentView: "home",
    inCombat: false,
    enemy: null,
    combatLog: [],
    day: 1,
    actionsRemaining: 3,
    notification: null,
    showInventory: false,
    inRun: false,
    runLevel: 0,
    currentEvent: null,
    showTechniqueSelection: null
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'breakthrough' | 'info' = 'info', rewards: any = null) => {
    let fullMessage = message;
    
    if (rewards) {
      const parts = [];
      if (rewards.gold) parts.push(`+${rewards.gold}💰`);
      if (rewards.spiritualQi) parts.push(`+${rewards.spiritualQi}✨`);
      if (rewards.reputation) parts.push(`+${rewards.reputation}⭐`);
      if (parts.length > 0) fullMessage = `${message} ${parts.join(' ')}`;
    }
    
    setGameState(prev => ({ ...prev, notification: { message: fullMessage, type } }));
    setTimeout(() => setGameState(prev => ({ ...prev, notification: null })), 3000);
  };

  const useAction = () => {
    setGameState(prev => {
      const newActions = prev.actionsRemaining - 1;
      if (newActions <= 0) {
        setTimeout(() => nextDay(), 500);
      }
      return { ...prev, actionsRemaining: newActions };
    });
  };

  const nextDay = () => {
    setGameState(prev => {
      const newQueue = prev.sect.buildingQueue.map(item => ({ 
        ...item, 
        daysRemaining: item.daysRemaining - 1 
      }));
      const completed = newQueue.filter(item => item.daysRemaining <= 0);
      const remaining = newQueue.filter(item => item.daysRemaining > 0);
      const newBuildings = { ...prev.sect.buildings };
      let persuasionBonus = 0, stealthBonus = 0;

      completed.forEach(item => {
        newBuildings[item.building] = item.targetLevel;
        showNotification(`${item.name} terminé!`, "success");
        if (item.building === 'studyHall') {
          persuasionBonus = 5;
          stealthBonus = 5;
        }
      });

      let learningUpdate = {};
      if (prev.player.learningTechnique) {
        const newDays = prev.player.learningTechnique.daysRemaining! - 1;
        if (newDays <= 0) {
          const learnedTech = { ...prev.player.learningTechnique };
          delete learnedTech.learnTime;
          delete learnedTech.daysRemaining;
          learningUpdate = { 
            techniques: [...prev.player.techniques, learnedTech], 
            learningTechnique: null 
          };
          showNotification(`${learnedTech.name} apprise!`, "success");
        } else {
          learningUpdate = { 
            learningTechnique: { 
              ...prev.player.learningTechnique, 
              daysRemaining: newDays 
            } 
          };
        }
      }

      return {
        ...prev,
        day: prev.day + 1,
        actionsRemaining: 3,
        player: {
          ...prev.player,
          persuasion: prev.player.persuasion + persuasionBonus,
          stealth: prev.player.stealth + stealthBonus,
          ...learningUpdate
        },
        sect: {
          ...prev.sect,
          gold: prev.sect.gold + (10 * prev.sect.disciples),
          spiritualQi: prev.sect.spiritualQi + (20 + (prev.sect.buildings.garden * 50)),
          buildings: newBuildings,
          buildingQueue: remaining
        }
      };
    });
  };

  const setView = (view: string) => {
    setGameState(prev => ({ ...prev, currentView: view }));
  };

  const toggleInventory = () => {
    setGameState(prev => ({ ...prev, showInventory: !prev.showInventory }));
  };

  return {
    gameState,
    setGameState,
    showNotification,
    useAction,
    nextDay,
    setView,
    toggleInventory
  };
};