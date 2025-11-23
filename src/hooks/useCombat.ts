import type { GameState, Technique } from '../types/gameTypes';

export const useCombat = (gameState: GameState, setGameState: any, showNotification: any, generateEvent: any, endRun: any) => {
  const playerAttack = (technique: Technique) => {
    if (gameState.player.qi < technique.qiCost || !gameState.enemy || !gameState.inCombat) return;

    if (technique.type === "defense") {
      setGameState((prev: GameState) => {
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

    setGameState((prev: GameState) => {
      if (!prev.enemy || !prev.inCombat) return prev;
      
      const newEnemyHealth = Math.max(0, prev.enemy.health - actualDamage);
      const updatedLog = [...prev.combatLog, `${technique.name}: ${actualDamage} dégâts`];

      if (newEnemyHealth <= 0) {
        if (prev.inRun) {
          // Combat de run gagné - progression au niveau suivant
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
              setGameState((current: GameState) => ({
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
              endRun();
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
    setGameState((prev: GameState) => {
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

      return { 
        ...prev, 
        player: { ...prev.player, health: newPlayerHealth }, 
        combatLog: newLog 
      };
    });
  };

  const startCombat = (enemy: any) => {
    setGameState((prev: GameState) => ({
      ...prev,
      inCombat: true,
      enemy: {
        ...enemy,
        techniques: [
          { name: "Attaque", damage: Math.floor(enemy.attack * 0.8), qiCost: 15 },
          { name: "Frappe", damage: enemy.attack, qiCost: 20 }
        ]
      },
      combatLog: [`${enemy.name} attaque!`]
    }));
  };

  return {
    playerAttack,
    enemyTurn,
    startCombat
  };
};