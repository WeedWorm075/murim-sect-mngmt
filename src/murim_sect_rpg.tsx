import React, { useState } from 'react';
import { Sparkles, Swords, Users, BookOpen, Leaf, Home, Map, Package } from 'lucide-react';

const MurimSectRPG = () => {
  const [gameState, setGameState] = useState({
    player: {
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
      techniques: [
        { name: "Poing du Dragon", damage: 25, qiCost: 15, type: "attack", grade: "human" },
        { name: "Garde de Fer", defense: 20, qiCost: 10, type: "defense", grade: "human" },
        { name: "Frappe Basique", damage: 15, qiCost: 0, type: "attack", grade: "human" }
      ],
      maxTechniques: 6,
      equipment: { weapon: null, armor: null, accessory: null },
      inventory: [],
      learningTechnique: null
    },
    sect: {
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
    },
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

  const cultivationLevels = [
    { name: "Qi Gathering", maxLevel: 9, progressPerLevel: 100 },
    { name: "Foundation", maxLevel: 9, progressPerLevel: 150 },
    { name: "Core Formation", maxLevel: 9, progressPerLevel: 200 },
    { name: "Nascent Soul", maxLevel: 9, progressPerLevel: 300 },
    { name: "Spirit Severing", maxLevel: 9, progressPerLevel: 500 }
  ];

  const itemGrades = {
    human: { name: "Humain", color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-400", chance: 0.50 },
    earth: { name: "Terre", color: "text-green-700", bg: "bg-green-100", border: "border-green-500", chance: 0.30 },
    heaven: { name: "Céleste", color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-500", chance: 0.15 },
    immortal: { name: "Immortel", color: "text-purple-700", bg: "bg-purple-100", border: "border-purple-500", chance: 0.05 }
  };

  const eventTypes = {
    combat: { name: "Combat", icon: "⚔️", chance: 0.40, minLevel: 1, maxLevel: 8 },
    treasure: { name: "Trouvaille", icon: "💎", chance: 0.25, minLevel: 1, maxLevel: 9 },
    merchant: { name: "Marchand", icon: "🏪", chance: 0.15, minLevel: 2, maxLevel: 7 },
    enlightenment: { name: "Illumination", icon: "✨", chance: 0.05, minLevel: 3, maxLevel: 9 },
    technique: { name: "Technique", icon: "📜", chance: 0.03, minLevel: 4, maxLevel: 9 },
    event: { name: "Événement", icon: "❓", chance: 0.12, minLevel: 1, maxLevel: 9 }
  };

  const buildings = {
    cultivationHall: { name: "Salle de Cultivation", cost: 300, qiCost: 200, effect: "Cultivation +20%", buildTime: 2 },
    library: { name: "Bibliothèque", cost: 400, qiCost: 300, effect: "Nouvelles techniques", buildTime: 3 },
    garden: { name: "Jardin Spirituel", cost: 350, qiCost: 250, effect: "+50 Qi/jour", buildTime: 2 },
    forge: { name: "Forge Céleste", cost: 500, qiCost: 400, effect: "Artefacts", buildTime: 4 },
    studyHall: { name: "Salle d'Étude", cost: 400, qiCost: 300, effect: "+5 Persuasion/Discrétion", buildTime: 3 }
  };

  const locations = [
    {
      id: "forest",
      name: "Forêt des Ombres",
      enemies: [{ name: "Loup Spirituel", health: 80, attack: 18, defense: 12 }],
      rewards: { gold: 100, spiritualQi: 50, reputation: 10, herbs: 3 },
      icon: "🌲"
    },
    {
      id: "cave",
      name: "Grotte des Cristaux",
      enemies: [{ name: "Chauve-souris de Jade", health: 70, attack: 15, defense: 10 }],
      rewards: { gold: 80, spiritualQi: 80, reputation: 8, minerals: 2 },
      icon: "⛰️"
    }
  ];

  const showNotification = (message, type = 'info', rewards = null) => {
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

  const cultivate = () => {
    if (gameState.sect.spiritualQi < 20 || gameState.actionsRemaining <= 0) return;
    
    const currentStage = cultivationLevels.findIndex(l => l.name === gameState.player.cultivation);
    const stage = cultivationLevels[currentStage];
    const gain = 10 + (gameState.sect.buildings.cultivationHall * 5);

    setGameState(prev => {
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
    
    setGameState(prev => ({
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

  const selectLocation = (location) => {
    if (gameState.actionsRemaining <= 0) return;

    const enemy = location.enemies[0];
    setGameState(prev => ({
      ...prev,
      inCombat: true,
      currentLocation: location,
      enemy: {
        ...enemy,
        maxHealth: enemy.health,
        techniques: [
          { name: "Attaque", damage: Math.floor(enemy.attack * 0.8), qiCost: 15 },
          { name: "Frappe", damage: enemy.attack, qiCost: 20 }
        ]
      },
      combatLog: [`${location.name}`, `${enemy.name} attaque!`]
    }));
    useAction();
  };

  const playerAttack = (technique) => {
    if (gameState.player.qi < technique.qiCost || !gameState.enemy || !gameState.inCombat) return;

    if (technique.type === "defense") {
      setGameState(prev => {
        if (!prev.inCombat || !prev.enemy) return prev;
        return {
          ...prev,
          player: { ...prev.player, qi: prev.player.qi - technique.qiCost },
          combatLog: [...prev.combatLog, `${technique.name}!`]
        };
      });
      setTimeout(() => enemyTurn(), 1000);
      return;
    }

    const damage = (technique.damage || 0) + Math.floor(Math.random() * 10) - (gameState.enemy?.defense || 0);
    const actualDamage = Math.max(5, damage);

    setGameState(prev => {
      if (!prev.enemy || !prev.inCombat) return prev;
      
      const newEnemyHealth = Math.max(0, prev.enemy.health - actualDamage);
      const updatedLog = [...prev.combatLog, `${technique.name}: ${actualDamage} dégâts`];

      if (newEnemyHealth <= 0) {
        // Victoire en run ou exploration normale
        if (prev.inRun) {
          // Combat de run gagné
          const reward = {
            gold: 50 + (prev.runLevel * 20),
            spiritualQi: 30 + (prev.runLevel * 10)
          };
          
          setTimeout(() => showNotification("Victoire!", "success", reward), 100);
          
          // Passer au niveau suivant du run
          setTimeout(() => {
            if (prev.runLevel < 9) {
              const nextLevel = prev.runLevel + 1;
              const eventType = generateEvent(nextLevel);
              setGameState(current => ({
                ...current,
                runLevel: nextLevel,
                currentEvent: { type: eventType, level: nextLevel },
                inCombat: false,
                enemy: null,
                player: { ...current.player, qi: current.player.qi - technique.qiCost },
                sect: {
                  ...current.sect,
                  gold: current.sect.gold + reward.gold,
                  spiritualQi: current.sect.spiritualQi + reward.spiritualQi
                }
              }));
              showNotification(`Niveau ${nextLevel}/9`, "info");
            } else {
              // Fin du run
              setGameState(current => ({
                ...current,
                inRun: false,
                runLevel: 0,
                inCombat: false,
                enemy: null,
                currentEvent: null,
                player: { ...current.player, qi: current.player.qi - technique.qiCost },
                sect: {
                  ...current.sect,
                  gold: current.sect.gold + reward.gold,
                  spiritualQi: current.sect.spiritualQi + reward.spiritualQi
                }
              }));
              showNotification("Run terminé!", "success");
            }
          }, 1500);
          
          return {
            ...prev,
            player: { ...prev.player, qi: prev.player.qi - technique.qiCost },
            enemy: { ...prev.enemy, health: newEnemyHealth },
            combatLog: [...updatedLog, 'Victoire!']
          };
        } else {
          // Combat d'exploration normal
          const reward = prev.currentLocation ? prev.currentLocation.rewards : {};
          setTimeout(() => showNotification("Victoire!", "success", reward), 100);
          
          return {
            ...prev,
            inCombat: false,
            currentLocation: null,
            enemy: null,
            player: { ...prev.player, qi: prev.player.qi - technique.qiCost },
            sect: {
              ...prev.sect,
              gold: prev.sect.gold + (reward.gold || 0),
              reputation: prev.sect.reputation + (reward.reputation || 0),
              spiritualQi: prev.sect.spiritualQi + (reward.spiritualQi || 0),
              resources: {
                herbs: prev.sect.resources.herbs + (reward.herbs || 0),
                minerals: prev.sect.resources.minerals + (reward.minerals || 0),
                artifacts: prev.sect.resources.artifacts + (reward.artifacts || 0),
                scrolls: prev.sect.resources.scrolls + (reward.scrolls || 0)
              }
            },
            combatLog: [...updatedLog, 'Victoire!'],
            currentView: 'home'
          };
        }
      }

      setTimeout(() => enemyTurn(), 1000);

      return {
        ...prev,
        player: { ...prev.player, qi: prev.player.qi - technique.qiCost },
        enemy: { ...prev.enemy, health: newEnemyHealth },
        combatLog: updatedLog
      };
    });
  };

  const enemyTurn = () => {
    setGameState(prev => {
      if (!prev.inCombat || !prev.enemy || prev.enemy.health <= 0) return prev;

      const technique = prev.enemy.techniques[Math.floor(Math.random() * prev.enemy.techniques.length)];
      const damage = technique.damage + Math.floor(Math.random() * 8) - prev.player.defense;
      const actualDamage = Math.max(3, damage);
      const newPlayerHealth = Math.max(0, prev.player.health - actualDamage);
      const newLog = [...prev.combatLog, `${prev.enemy.name}: ${actualDamage} dégâts`];

      if (newPlayerHealth <= 0) {
        showNotification("Défaite...", "error");
        return {
          ...prev,
          inCombat: false,
          currentLocation: null,
          enemy: null,
          player: { ...prev.player, health: 1, qi: prev.player.maxQi / 2 },
          combatLog: [...newLog, "Défaite..."],
          currentView: 'home'
        };
      }

      return { ...prev, player: { ...prev.player, health: newPlayerHealth }, combatLog: newLog };
    });
  };

  const upgradeBuilding = (buildingKey) => {
    const building = buildings[buildingKey];
    const currentLevel = gameState.sect.buildings[buildingKey];

    if (gameState.sect.gold >= building.cost && gameState.sect.spiritualQi >= building.qiCost) {
      setGameState(prev => ({
        ...prev,
        sect: {
          ...prev.sect,
          gold: prev.sect.gold - building.cost,
          spiritualQi: prev.sect.spiritualQi - building.qiCost,
          buildingQueue: [
            ...prev.sect.buildingQueue,
            { building: buildingKey, name: building.name, daysRemaining: building.buildTime, targetLevel: currentLevel + 1 }
          ]
        }
      }));
      showNotification(`${building.name} (${building.buildTime}j)`, "success");
    }
  };

  const nextDay = () => {
    setGameState(prev => {
      const newQueue = prev.sect.buildingQueue.map(item => ({ ...item, daysRemaining: item.daysRemaining - 1 }));
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
        const newDays = prev.player.learningTechnique.daysRemaining - 1;
        if (newDays <= 0) {
          const learnedTech = { ...prev.player.learningTechnique };
          delete learnedTech.learnTime;
          delete learnedTech.daysRemaining;
          learningUpdate = { techniques: [...prev.player.techniques, learnedTech], learningTechnique: null };
          showNotification(`${learnedTech.name} apprise!`, "success");
        } else {
          learningUpdate = { learningTechnique: { ...prev.player.learningTechnique, daysRemaining: newDays } };
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

  // Fonctions pour le système de Run
  const getItemGrade = () => {
    const rand = Math.random();
    let cumulative = 0;
    for (const [grade, info] of Object.entries(itemGrades)) {
      cumulative += info.chance;
      if (rand < cumulative) return grade;
    }
    return 'human';
  };

  const generateItem = (itemType, grade) => {
    const id = Date.now() + Math.random();
    const gradeInfo = itemGrades[grade];
    
    if (itemType === 'weapon') {
      const bonus = grade === 'human' ? 5 : grade === 'earth' ? 15 : grade === 'heaven' ? 30 : 50;
      return {
        id, name: `Épée ${gradeInfo.name}`, type: 'weapon', grade,
        attack: bonus, description: `+${bonus} ATK`
      };
    } else if (itemType === 'armor') {
      const bonus = grade === 'human' ? 3 : grade === 'earth' ? 10 : grade === 'heaven' ? 20 : 35;
      return {
        id, name: `Armure ${gradeInfo.name}`, type: 'armor', grade,
        defense: bonus, description: `+${bonus} DEF`
      };
    } else {
      const effect = grade === 'human' ? 'health' : grade === 'earth' ? 'qi' : grade === 'heaven' ? 'stats' : 'cultivation';
      return {
        id, name: `Pilule ${gradeInfo.name}`, type: 'pill', grade, effect,
        description: effect === 'health' ? '+50 HP' : effect === 'qi' ? '+50 Qi' : effect === 'stats' ? '+5 ATK/DEF' : '+100 Cult'
      };
    }
  };

  const generateEvent = (level) => {
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

  const generateRunEnemy = (level) => {
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

  const generateTechnique = (grade) => {
    const gradeInfo = itemGrades[grade];
    const damage = grade === 'human' ? 30 : grade === 'earth' ? 45 : grade === 'heaven' ? 65 : 100;
    const qiCost = grade === 'human' ? 20 : grade === 'earth' ? 25 : grade === 'heaven' ? 35 : 50;
    const learnTime = grade === 'human' ? 2 : grade === 'earth' ? 4 : grade === 'heaven' ? 7 : 10;
    
    const elements = ['Feu', 'Eau', 'Terre', 'Métal', 'Bois', 'Foudre', 'Vent'];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    const techniques = [
      `Paume du ${element}`,
      `Épée du ${element}`,
      `Poing du ${element}`,
      `Déferlante du ${element}`,
      `Souffle du ${element}`
    ];
    
    const name = techniques[Math.floor(Math.random() * techniques.length)];
    
    return {
      name: `${name} [${gradeInfo.name}]`,
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
    
    setGameState(prev => ({
      ...prev,
      inRun: true,
      runLevel: 1,
      currentEvent: null
    }));
    
    useAction();
    showNotification("Run commencé! Niveau 1/9", "success");
    
    setTimeout(() => {
      const eventType = generateEvent(1);
      setGameState(prev => ({
        ...prev,
        currentEvent: { type: eventType, level: 1 }
      }));
    }, 500);
  };

  const handleEventChoice = (choice) => {
    const event = gameState.currentEvent;
    
    if (event.type === 'combat') {
      // Démarrer un combat de run
      const enemy = generateRunEnemy(event.level);
      setGameState(prev => ({
        ...prev,
        inCombat: true,
        enemy: enemy,
        combatLog: [`Niveau ${event.level}/9`, `${enemy.name} vous attaque!`],
        currentEvent: null
      }));
      return;
      
    } else if (event.type === 'treasure') {
      const types = ['weapon', 'armor', 'pill'];
      const itemType = types[Math.floor(Math.random() * types.length)];
      const grade = getItemGrade();
      const item = generateItem(itemType, grade);
      
      setGameState(prev => ({
        ...prev,
        player: { ...prev.player, inventory: [...prev.player.inventory, item] },
        currentEvent: null
      }));
      
      showNotification(`${item.name} trouvé!`, "success");
      
    } else if (event.type === 'enlightenment') {
      const bonus = 50;
      setGameState(prev => ({
        ...prev,
        player: { ...prev.player, cultivationProgress: prev.player.cultivationProgress + bonus },
        currentEvent: null
      }));
      showNotification(`Illumination! +${bonus} Cult`, "breakthrough");
      
    } else if (event.type === 'technique') {
      const grade = getItemGrade();
      const technique = generateTechnique(grade);
      
      if (gameState.player.techniques.length < gameState.player.maxTechniques) {
        // Apprendre directement
        setGameState(prev => ({
          ...prev,
          player: { ...prev.player, learningTechnique: technique },
          currentEvent: null
        }));
        showNotification(`Technique trouvée! Apprentissage ${technique.learnTime}j`, "success");
      } else {
        // Choisir quelle technique remplacer
        setGameState(prev => ({
          ...prev,
          showTechniqueSelection: technique,
          currentEvent: null
        }));
      }
      
    } else if (event.type === 'merchant') {
      setGameState(prev => ({ ...prev, currentEvent: null }));
      showNotification("Marchand rencontré", "info");
    } else {
      setGameState(prev => ({ ...prev, currentEvent: null }));
      showNotification("Événement étrange...", "info");
    }
    
    // Passer au niveau suivant
    if (gameState.runLevel < 9) {
      setTimeout(() => {
        const nextLevel = gameState.runLevel + 1;
        const eventType = generateEvent(nextLevel);
        setGameState(prev => ({
          ...prev,
          runLevel: nextLevel,
          currentEvent: { type: eventType, level: nextLevel }
        }));
        showNotification(`Niveau ${nextLevel}/9`, "info");
      }, 500);
    } else {
      endRun();
    }
  };

  const replaceTechnique = (oldTech) => {
    const newTech = gameState.showTechniqueSelection;
    
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        techniques: prev.player.techniques.filter(t => t.name !== oldTech.name),
        learningTechnique: newTech
      },
      showTechniqueSelection: null
    }));
    
    showNotification(`${oldTech.name} remplacée! Apprentissage ${newTech.learnTime}j`, "success");
  };

  const exitRun = () => {
    if (gameState.runLevel >= 8) {
      showNotification("Impossible après niveau 7!", "error");
      return;
    }
    endRun();
  };

  const endRun = () => {
    setGameState(prev => ({
      ...prev,
      inRun: false,
      runLevel: 0,
      currentEvent: null
    }));
    showNotification("Run terminé!", "success");
  };

  const equipItem = (item) => {
    if (item.type === 'pill') return;
    
    setGameState(prev => {
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

  const usePill = (pill) => {
    setGameState(prev => {
      const newInventory = prev.player.inventory.filter(i => i.id !== pill.id);
      const updates = { inventory: newInventory };
      
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

  const currentCultivationStage = cultivationLevels.find(l => l.name === gameState.player.cultivation);

  const renderHome = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-600 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-amber-900">Profil</h3>
            <Sparkles className="text-amber-600" />
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-amber-800"><strong>Cultivation:</strong> {gameState.player.cultivation} Niv.{gameState.player.cultivationLevel}/9</p>
            <p className="text-amber-800"><strong>ATK:</strong> {gameState.player.attack} | <strong>DEF:</strong> {gameState.player.defense}</p>
            <p className="text-amber-800"><strong>Persuasion:</strong> {gameState.player.persuasion} | <strong>Discrétion:</strong> {gameState.player.stealth}</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-amber-700 mb-1">
                <span>Progression</span>
                <span>{gameState.player.cultivationProgress}/{currentCultivationStage.progressPerLevel}</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(gameState.player.cultivationProgress / currentCultivationStage.progressPerLevel) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg border-2 border-red-600 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-red-900">Combat</h3>
            <Swords className="text-red-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="flex justify-between text-xs text-red-700 mb-1">
                <span>Santé</span>
                <span>{gameState.player.health}/{gameState.player.maxHealth}</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-blue-700 mb-1">
                <span>Qi</span>
                <span>{gameState.player.qi}/{gameState.player.maxQi}</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(gameState.player.qi / gameState.player.maxQi) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-600 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-emerald-900">{gameState.sect.name}</h3>
          <Home className="text-emerald-600" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-28 text-center p-3 bg-yellow-100 rounded-lg">
            <p className="text-yellow-900 font-bold text-lg">{gameState.sect.gold}</p>
            <p className="text-yellow-700 text-xs">Or</p>
          </div>
          <div className="flex-1 min-w-28 text-center p-3 bg-purple-100 rounded-lg">
            <p className="text-purple-900 font-bold text-lg">{gameState.sect.spiritualQi}</p>
            <p className="text-purple-700 text-xs">Qi</p>
          </div>
          <div className="flex-1 min-w-28 text-center p-3 bg-blue-100 rounded-lg">
            <p className="text-blue-900 font-bold text-lg">{gameState.sect.disciples}</p>
            <p className="text-blue-700 text-xs">Disciples</p>
          </div>
          <div className="flex-1 min-w-28 text-center p-3 bg-pink-100 rounded-lg">
            <p className="text-pink-900 font-bold text-lg">{gameState.sect.reputation}</p>
            <p className="text-pink-700 text-xs">Réputation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={cultivate} disabled={gameState.sect.spiritualQi < 20 || gameState.actionsRemaining <= 0}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg">
          <Sparkles className="inline mr-2" size={20} />Cultiver
        </button>
        <button onClick={rest} disabled={gameState.actionsRemaining <= 0}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg">
          <Leaf className="inline mr-2" size={20} />Repos
        </button>
        <button onClick={startRun} disabled={gameState.actionsRemaining <= 0}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-lg font-bold hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg">
          <Map className="inline mr-2" size={20} />Run (9 niveaux)
        </button>
        <div className="bg-gradient-to-r from-slate-700 to-gray-700 text-white p-4 rounded-lg font-bold shadow-lg text-center">
          <div className="text-2xl">{gameState.actionsRemaining}/3</div>
          <div className="text-xs mt-1">Actions | Jour {gameState.day}</div>
        </div>
      </div>
    </div>
  );

  const renderSect = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-600 shadow-lg">
        <h2 className="text-2xl font-bold text-emerald-900 mb-4">Stats & Ressources</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-24 text-center p-2 bg-yellow-100 rounded"><p className="text-yellow-900 font-bold">{gameState.sect.gold}</p><p className="text-yellow-700 text-xs">💰</p></div>
          <div className="flex-1 min-w-24 text-center p-2 bg-purple-100 rounded"><p className="text-purple-900 font-bold">{gameState.sect.spiritualQi}</p><p className="text-purple-700 text-xs">✨</p></div>
          <div className="flex-1 min-w-24 text-center p-2 bg-green-100 rounded"><p className="text-green-900 font-bold">{gameState.sect.resources.herbs}</p><p className="text-green-700 text-xs">🌿</p></div>
          <div className="flex-1 min-w-24 text-center p-2 bg-gray-100 rounded"><p className="text-gray-900 font-bold">{gameState.sect.resources.minerals}</p><p className="text-gray-700 text-xs">⛏️</p></div>
        </div>
      </div>

      {gameState.sect.buildingQueue.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-400 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-orange-900 mb-2">🔨 En construction</h3>
          {gameState.sect.buildingQueue.map((item, idx) => (
            <div key={idx} className="bg-white p-2 rounded mb-2 flex justify-between text-sm">
              <span className="font-semibold">{item.name}</span>
              <span className="text-orange-700">{item.daysRemaining}j</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-emerald-900">Bâtiments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(buildings).map(([key, building]) => {
          const level = gameState.sect.buildings[key];
          const inQueue = gameState.sect.buildingQueue.some(item => item.building === key);
          return (
            <div key={key} className="bg-gradient-to-br from-stone-100 to-slate-100 p-4 rounded-lg border-2 border-stone-400 shadow-lg">
              <h3 className="text-lg font-bold text-stone-800 mb-1">{building.name}</h3>
              <p className="text-xs text-stone-600 mb-1">Niv.{level} | {building.effect}</p>
              <p className="text-xs text-orange-600 mb-3">⏰ {building.buildTime}j</p>
              <button onClick={() => upgradeBuilding(key)} disabled={inQueue || gameState.sect.gold < building.cost || gameState.sect.spiritualQi < building.qiCost}
                className="w-full bg-emerald-600 text-white py-2 rounded font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
                {inQueue ? '🔨 En cours...' : `Améliorer (${building.cost}💰 ${building.qiCost}✨)`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-amber-900 text-center mb-6">🗺️ Exploration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map(loc => (
          <div key={loc.id} onClick={() => selectLocation(loc)}
            className="bg-gradient-to-br from-stone-100 to-slate-100 p-6 rounded-lg border-2 border-amber-500 shadow-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{loc.icon}</span>
              <h4 className="text-lg font-bold text-stone-900">{loc.name}</h4>
            </div>
            <p className="text-xs text-stone-700">{loc.enemies[0].name}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setGameState(prev => ({ ...prev, currentView: 'home' }))}
        className="w-full bg-gradient-to-r from-stone-600 to-slate-600 text-white py-3 rounded-lg font-bold hover:from-stone-700 hover:to-slate-700 transition-all shadow-lg">
        ← Retour
      </button>
    </div>
  );

  const renderCombat = () => {
    if (!gameState.inCombat || !gameState.enemy) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-red-900 to-orange-900 p-8 rounded-lg border-4 border-yellow-500 max-w-4xl w-full shadow-2xl">
          <h2 className="text-3xl font-bold text-yellow-200 mb-6 text-center">⚔️ Combat!</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg border-2 border-blue-400">
              <h3 className="text-xl font-bold text-blue-200 mb-3">Vous</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-blue-200 mb-1">
                    <span>Santé</span>
                    <span>{gameState.player.health}/{gameState.player.maxHealth}</span>
                  </div>
                  <div className="w-full bg-red-900 rounded-full h-3">
                    <div className="bg-red-400 h-3 rounded-full transition-all"
                      style={{ width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-blue-200 mb-1">
                    <span>Qi</span>
                    <span>{gameState.player.qi}/{gameState.player.maxQi}</span>
                  </div>
                  <div className="w-full bg-blue-900 rounded-full h-3">
                    <div className="bg-blue-400 h-3 rounded-full transition-all"
                      style={{ width: `${(gameState.player.qi / gameState.player.maxQi) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg border-2 border-red-400">
              <h3 className="text-xl font-bold text-red-200 mb-3">{gameState.enemy.name}</h3>
              <div>
                <div className="flex justify-between text-xs text-red-200 mb-1">
                  <span>Santé</span>
                  <span>{gameState.enemy.health}/{gameState.enemy.maxHealth}</span>
                </div>
                <div className="w-full bg-red-900 rounded-full h-3">
                  <div className="bg-red-400 h-3 rounded-full transition-all"
                    style={{ width: `${(gameState.enemy.health / gameState.enemy.maxHealth) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-40 p-4 rounded-lg mb-6 h-32 overflow-y-auto">
            {gameState.combatLog.map((log, idx) => (
              <p key={idx} className="text-yellow-100 text-sm mb-1">{log}</p>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {gameState.player.techniques.map((tech, idx) => (
              <button key={idx} onClick={() => playerAttack(tech)} disabled={gameState.player.qi < tech.qiCost}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 px-4 rounded-lg font-bold hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg">
                {tech.name}
                <div className="text-xs">{tech.qiCost} Qi</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-red-900 p-4">
      {gameState.notification && (
        <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-lg shadow-2xl text-sm font-semibold ${
          gameState.notification.type === 'success' ? 'bg-green-500' :
          gameState.notification.type === 'error' ? 'bg-red-500' :
          gameState.notification.type === 'breakthrough' ? 'bg-purple-500' : 'bg-blue-500'
        } text-white`}>
          {gameState.notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 p-6 rounded-t-lg border-4 border-yellow-500 shadow-2xl">
          <h1 className="text-4xl font-bold text-center text-white tracking-wider" style={{ fontFamily: 'serif' }}>
            ⚔️ 武林宗主 ⚔️
          </h1>
          <p className="text-center text-yellow-100 mt-2 text-lg">Murim Sect Master</p>
        </div>

        <div className="bg-gradient-to-r from-stone-800 to-slate-800 border-x-4 border-yellow-500 shadow-xl">
          <div className="flex flex-wrap justify-center gap-2 p-4">
            <button onClick={() => setGameState(prev => ({ ...prev, currentView: 'home' }))}
              className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                gameState.currentView === 'home'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}>
              <Home className="inline mr-2" size={18} />Accueil
            </button>
            <button onClick={() => setGameState(prev => ({ ...prev, currentView: 'sect' }))}
              className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                gameState.currentView === 'sect'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}>
              <Users className="inline mr-2" size={18} />Secte
            </button>
            <button onClick={() => setGameState(prev => ({ ...prev, showInventory: !prev.showInventory }))}
              className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                gameState.showInventory
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}>
              <Package className="inline mr-2" size={18} />Inventaire
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-b-lg border-x-4 border-b-4 border-yellow-500 shadow-2xl min-h-96">
          {gameState.currentView === 'home' && renderHome()}
          {gameState.currentView === 'sect' && renderSect()}
          {gameState.currentView === 'map' && renderMap()}
          {gameState.showInventory && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-900">📦 Inventaire</h2>
              
              {/* Équipement */}
              <div className="bg-white p-4 rounded-lg border-2 border-amber-400">
                <h3 className="font-bold text-amber-900 mb-3">⚔️ Équipement</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['weapon', 'armor', 'accessory'].map(slot => {
                    const item = gameState.player.equipment[slot];
                    return (
                      <div key={slot} className="bg-gray-100 p-3 rounded border-2 border-gray-300 text-center">
                        <p className="text-xs text-gray-600 mb-2">{slot === 'weapon' ? 'Arme' : slot === 'armor' ? 'Armure' : 'Accessoire'}</p>
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
                  })}
                </div>
              </div>

              {/* Items */}
              {gameState.player.inventory.length === 0 ? (
                <p className="text-amber-700">Inventaire vide</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gameState.player.inventory.map((item) => {
                    const gradeInfo = itemGrades[item.grade];
                    return (
                      <div key={item.id} className={`${gradeInfo.bg} p-4 rounded-lg border-2 ${gradeInfo.border}`}>
                        <p className={`font-bold text-sm ${gradeInfo.color}`}>{item.name}</p>
                        <p className="text-xs text-gray-700 mb-2">{item.description}</p>
                        {item.type === 'pill' ? (
                          <button onClick={() => usePill(item)}
                            className="w-full bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600">
                            Utiliser
                          </button>
                        ) : (
                          <button onClick={() => equipItem(item)}
                            className="w-full bg-blue-500 text-white text-xs py-1 rounded hover:bg-blue-600">
                            Équiper
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 bg-stone-900 p-4 rounded-lg border-2 border-yellow-600 shadow-xl">
          <p className="text-center text-yellow-400 text-sm">
            Jour {gameState.day} | {gameState.sect.name} | {gameState.player.cultivation} Niv.{gameState.player.cultivationLevel}
          </p>
        </div>
      </div>

      {renderCombat()}
      
      {/* Run Event Modal */}
      {gameState.inRun && gameState.currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-8 rounded-lg border-4 border-amber-600 max-w-2xl w-full shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-amber-900 mb-2">
                Niveau {gameState.runLevel}/9
              </h2>
              <p className="text-lg text-amber-700">
                {eventTypes[gameState.currentEvent.type].icon} {eventTypes[gameState.currentEvent.type].name}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg mb-6">
              {gameState.currentEvent.type === 'combat' && (
                <div className="text-center">
                  <p className="text-lg mb-4">⚔️ Un ennemi vous barre la route!</p>
                  <p className="text-sm text-gray-600">Préparez-vous au combat...</p>
                </div>
              )}
              {gameState.currentEvent.type === 'treasure' && (
                <div className="text-center">
                  <p className="text-lg mb-4">💎 Vous découvrez un trésor!</p>
                  <p className="text-sm text-gray-600">Un objet mystérieux brille devant vous...</p>
                </div>
              )}
              {gameState.currentEvent.type === 'enlightenment' && (
                <div className="text-center">
                  <p className="text-lg mb-4">✨ Une illumination soudaine!</p>
                  <p className="text-sm text-gray-600">Votre compréhension du Dao s'approfondit...</p>
                </div>
              )}
              {gameState.currentEvent.type === 'technique' && (
                <div className="text-center">
                  <p className="text-lg mb-4">📜 Un manuel de technique ancienne!</p>
                  <p className="text-sm text-gray-600">Vous découvrez une technique perdue...</p>
                </div>
              )}
              {gameState.currentEvent.type === 'merchant' && (
                <div className="text-center">
                  <p className="text-lg mb-4">🏪 Un marchand errant!</p>
                  <p className="text-sm text-gray-600">Il propose ses marchandises...</p>
                </div>
              )}
              {gameState.currentEvent.type === 'event' && (
                <div className="text-center">
                  <p className="text-lg mb-4">❓ Un événement étrange...</p>
                  <p className="text-sm text-gray-600">Quelque chose d'inattendu se produit...</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button onClick={() => handleEventChoice('accept')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
                {gameState.currentEvent.type === 'combat' ? 'Combattre' : 'Accepter / Continuer'}
              </button>
              
              {gameState.runLevel < 8 && (
                <button onClick={exitRun}
                  className="w-full bg-gradient-to-r from-gray-600 to-slate-600 text-white p-3 rounded-lg font-semibold hover:from-gray-700 hover:to-slate-700 transition-all">
                  ← Quitter le Run
                </button>
              )}
            </div>
            
            {gameState.runLevel >= 8 && (
              <p className="text-center text-red-600 text-sm mt-4 font-bold">
                ⚠️ Impossible de quitter après niveau 7
              </p>
            )}
          </div>
        </div>
      )}

      {/* Technique Selection Modal */}
      {gameState.showTechniqueSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-lg border-4 border-purple-600 max-w-3xl w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-900 mb-4 text-center">
              📜 Nouvelle Technique Trouvée!
            </h2>
            
            <div className={`${itemGrades[gameState.showTechniqueSelection.grade].bg} p-4 rounded-lg border-2 ${itemGrades[gameState.showTechniqueSelection.grade].border} mb-6`}>
              <p className={`font-bold text-lg ${itemGrades[gameState.showTechniqueSelection.grade].color}`}>
                {gameState.showTechniqueSelection.name}
              </p>
              <p className="text-sm mt-2">Dégâts: {gameState.showTechniqueSelection.damage} | Qi: {gameState.showTechniqueSelection.qiCost}</p>
              <p className="text-sm">Apprentissage: {gameState.showTechniqueSelection.learnTime} jours</p>
            </div>

            <p className="text-center text-purple-900 font-semibold mb-4">
              Vos techniques sont pleines ({gameState.player.techniques.length}/{gameState.player.maxTechniques}). Choisissez une technique à remplacer:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {gameState.player.techniques.map((tech) => (
                <button
                  key={tech.name}
                  onClick={() => replaceTechnique(tech)}
                  className="bg-white p-3 rounded-lg border-2 border-purple-400 hover:bg-purple-50 transition-all text-left">
                  <p className="font-bold text-sm text-purple-900">{tech.name}</p>
                  <p className="text-xs text-gray-600">Dégâts: {tech.damage || 0} | Qi: {tech.qiCost}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setGameState(prev => ({ ...prev, showTechniqueSelection: null }))}
              className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all">
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MurimSectRPG;