import { itemGrades } from '../data/itemGrades';
import { eventTypes } from '../data/eventTypes';
import { cultivationLevels } from '../data/cultivationLevels';
import { techniqueElements, techniqueNames } from '../data/techniques';
import type { GameState, Technique, Item } from '../types/gameTypes';

export const useRunSystem = (gameState: GameState, setGameState: any, showNotification: any, useAction: any) => {
  const getItemGrade = (): string => {
    const rand = Math.random();
    let cumulative = 0;
    for (const [grade, info] of Object.entries(itemGrades)) {
      cumulative += info.chance;
      if (rand < cumulative) return grade;
    }
    return 'human';
  };

  const generateItem = (itemType: string, grade: string): Item => {
    const id = Date.now() + Math.random();
    const gradeInfo = itemGrades[grade];
    
    if (itemType === 'weapon') {
      const bonus = grade === 'human' ? 5 : grade === 'earth' ? 15 : grade === 'heaven' ? 30 : 50;
      return {
        id, 
        name: `Épée ${gradeInfo.name}`, 
        type: 'weapon', 
        grade,
        attack: bonus, 
        description: `+${bonus} ATK`
      };
    } else if (itemType === 'armor') {
      const bonus = grade === 'human' ? 3 : grade === 'earth' ? 10 : grade === 'heaven' ? 20 : 35;
      return {
        id, 
        name: `Armure ${gradeInfo.name}`, 
        type: 'armor', 
        grade,
        defense: bonus, 
        description: `+${bonus} DEF`
      };
    } else {
      const effect = grade === 'human' ? 'health' : grade === 'earth' ? 'qi' : grade === 'heaven' ? 'stats' : 'cultivation';
      return {
        id, 
        name: `Pilule ${gradeInfo.name}`, 
        type: 'pill', 
        grade, 
        effect,
        description: effect === 'health' ? '+50 HP' : effect === 'qi' ? '+50 Qi' : effect === 'stats' ? '+5 ATK/DEF' : '+100 Cult'
      };
    }
  };

  const generateEvent = (level: number): string => {
    if (level === 9) {
      const rand = Math.random();
      if (rand < 0.60) return 'treasure';
      if (rand < 0.65) return 'enlightenment';
      if (rand < 0.68) return 'technique';
      return 'combat';
    }
    
    const available = Object.entries(eventTypes).filter(([key, ev]) => level >= ev.minLevel && level <= ev.maxLevel);
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [key, ev] of available) {
      cumulative += ev.chance;
      if (rand < cumulative) return key;
    }
    return 'combat';
  };

  const generateRunEnemy = (level: number) => {
    const cultivationIndex = cultivationLevels.findIndex(l => l.name === gameState.player.cultivation);
    const baseHealth = 60 + (level * 15) + (cultivationIndex * 30);
    const baseAttack = 12 + (level * 3) + (cultivationIndex * 5);
    const baseDefense = 8 + (level * 2) + (cultivationIndex * 3);
    
    const names = ['Bandit', 'Cultivateur Déchu', 'Bête Spirituelle', 'Gardien Ancien', 'Démon Mineur'];
    const name = names[Math.floor(Math.random() * names.length)];
    
    return {
      name: `${name} Niv.${level}`,
      health: baseHealth,
      maxHealth: baseHealth,
      attack: baseAttack,
      defense: baseDefense,
      techniques: [
        { name: "Attaque", damage: Math.floor(baseAttack * 0.8), qiCost: 10 },
        { name: "Frappe Lourde", damage: baseAttack, qiCost: 15 }
      ]
    };
  };

  const generateTechnique = (grade: string): Technique => {
    const gradeInfo = itemGrades[grade];
    const damage = grade === 'human' ? 30 : grade === 'earth' ? 45 : grade === 'heaven' ? 65 : 100;
    const qiCost = grade === 'human' ? 20 : grade === 'earth' ? 25 : grade === 'heaven' ? 35 : 50;
    const learnTime = grade === 'human' ? 2 : grade === 'earth' ? 4 : grade === 'heaven' ? 7 : 10;
    
    const element = techniqueElements[Math.floor(Math.random() * techniqueElements.length)];
    const techniqueName = techniqueNames[Math.floor(Math.random() * techniqueNames.length)];
    
    return {
      name: `${techniqueName} ${element} [${gradeInfo.name}]`,
      damage,
      qiCost,
      element: element.toLowerCase(),
      type: 'attack',
      grade,
      learnTime,
      daysRemaining: learnTime
    };
  };

  const startRun = () => {
    if (gameState.actionsRemaining <= 0) {
      showNotification("Plus d'actions!", "error");
      return;
    }
    
    setGameState((prev: GameState) => ({
      ...prev,
      inRun: true,
      runLevel: 1,
      currentEvent: null
    }));
    
    useAction();
    showNotification("Run commencé! Niveau 1/9", "success");
    
    setTimeout(() => {
      const eventType = generateEvent(1);
      setGameState((prev: GameState) => ({
        ...prev,
        currentEvent: { type: eventType, level: 1 }
      }));
    }, 500);
  };

  return {
    getItemGrade,
    generateItem,
    generateEvent,
    generateRunEnemy,
    generateTechnique,
    startRun
  };
};