import React from 'react';
import { useGameState } from './hooks/useGameState';
import { useCultivation } from './hooks/useCultivation';
import { useCombat } from './hooks/useCombat';
import { useSectManagement } from './hooks/useSectManagement';
import { useRunSystem } from './hooks/useRunSystem';
import { useInventory } from './hooks/useInventory';
import { locations } from './data/locations';

// Import Components
import { Header } from './components/UI/Header';
import { HomeScreen } from './components/GameScreens/HomeScreen';
import { SectScreen } from './components/GameScreens/SectScreen';
import { MapScreen } from './components/GameScreens/MapScreen';
import { InventoryPanel } from './components/UI/InventoryPanel';

// Import Modals
import { CombatModal } from './components/GameScreens/Modals/CombatModal';
import { RunEventModal } from './components/GameScreens/Modals/RunEventModal';
import { TechniqueSelectionModal } from './components/GameScreens/Modals/TechniqueSelectionModal';
import { Notification } from './components/GameScreens/Modals/Notification';

function App() {

  // -------------------------------------------------------
  // 1️⃣ Game State Hooks
  // -------------------------------------------------------
  const { 
    gameState, 
    setGameState, 
    showNotification, 
    useAction, 
    nextDay, 
    setView, 
    toggleInventory 
  } = useGameState();


  // -------------------------------------------------------
  // 2️⃣ Utility: endRun must be defined BEFORE useCombat
  // -------------------------------------------------------
  const endRun = () => {
    setGameState(prev => ({
      ...prev,
      inRun: false,
      runLevel: 0,
      currentEvent: null
    }));
    showNotification("Run terminé!", "success");
  };


  // -------------------------------------------------------
  // 3️⃣ Run System (must be before useCombat because it exports generateEvent)
  // -------------------------------------------------------
  const { 
    startRun, 
    generateItem, 
    generateEvent, 
    generateRunEnemy, 
    generateTechnique 
  } = useRunSystem(
    gameState, 
    setGameState, 
    showNotification, 
    useAction
  );


  // -------------------------------------------------------
  // 4️⃣ Combat Hooks (depends on generateEvent + endRun)
  // -------------------------------------------------------
  const { 
    playerAttack, 
    enemyTurn, 
    startCombat 
  } = useCombat(
    gameState, 
    setGameState, 
    showNotification, 
    generateEvent, 
    endRun
  );


  // -------------------------------------------------------
  // 5️⃣ Other Feature Hooks
  // -------------------------------------------------------
  const { cultivate, rest } = useCultivation(gameState, setGameState, useAction, showNotification);
  const { upgradeBuilding } = useSectManagement(gameState, setGameState, showNotification);
  const { equipItem, usePill } = useInventory(gameState, setGameState, showNotification);


  // -------------------------------------------------------
  // 6️⃣ Location selection handler
  // -------------------------------------------------------
  const selectLocation = (location: any) => {
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


  // -------------------------------------------------------
  // 7️⃣ Random grade generator
  // -------------------------------------------------------
  const generateItemGrade = () => {
    const rand = Math.random();
    let cumulative = 0;
    const itemGrades = {
      human: { chance: 0.50 },
      earth: { chance: 0.30 },
      heaven: { chance: 0.15 },
      immortal: { chance: 0.05 }
    };
    
    for (const [grade, info] of Object.entries(itemGrades)) {
      cumulative += info.chance;
      if (rand < cumulative) return grade;
    }
    return 'human';
  };


  // -------------------------------------------------------
  // 8️⃣ Run Event Handler
  // -------------------------------------------------------
  const handleEventChoice = (choice: string) => {
    const event = gameState.currentEvent;

    if (event.type === 'combat') {
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
      const grade = generateItemGrade();
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
      const grade = generateItemGrade();
      const technique = generateTechnique(grade);

      if (gameState.player.techniques.length < gameState.player.maxTechniques) {
        setGameState(prev => ({
          ...prev,
          player: { ...prev.player, learningTechnique: technique },
          currentEvent: null
        }));
        showNotification(`Technique trouvée! Apprentissage ${technique.learnTime}j`, "success");
      } else {
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

    // Next level
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


  // -------------------------------------------------------
  // 9️⃣ Technique replacement
  // -------------------------------------------------------
  const replaceTechnique = (oldTech: any) => {
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


  // -------------------------------------------------------
  // 🔟 exitRun (after endRun)
  // -------------------------------------------------------
  const exitRun = () => {
    if (gameState.runLevel >= 8) {
      showNotification("Impossible après niveau 7!", "error");
      return;
    }
    endRun();
  };


  // -------------------------------------------------------
  // 1️⃣1️⃣ UI Helpers
  // -------------------------------------------------------
  const closeTechniqueModal = () => {
    setGameState(prev => ({ ...prev, showTechniqueSelection: null }));
  };


  // -------------------------------------------------------
  // 1️⃣2️⃣ JSX Render
  // -------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-red-900 p-4">

      <Notification notification={gameState.notification} />

      <div className="max-w-6xl mx-auto">

        <div className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 p-6 rounded-t-lg border-4 border-yellow-500 shadow-2xl">
          <h1 className="text-4xl font-bold text-center text-white tracking-wider" style={{ fontFamily: 'serif' }}>
            ⚔️ 武林宗主 ⚔️
          </h1>
          <p className="text-center text-yellow-100 mt-2 text-lg">Murim Sect Master</p>
        </div>

        <Header 
          gameState={gameState} 
          setView={setView} 
          toggleInventory={toggleInventory} 
        />

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-b-lg border-x-4 border-b-4 border-yellow-500 shadow-2xl min-h-96">

          {gameState.showInventory ? (
            <InventoryPanel 
              player={gameState.player} 
              equipItem={equipItem} 
              usePill={usePill} 
            />
          ) : (
            <>
              {gameState.currentView === 'home' && (
                <HomeScreen 
                  gameState={gameState}
                  cultivate={cultivate}
                  rest={rest}
                  startRun={startRun}
                  setView={setView}
                />
              )}
              
              {gameState.currentView === 'sect' && (
                <SectScreen 
                  gameState={gameState}
                  upgradeBuilding={upgradeBuilding}
                />
              )}
              
              {gameState.currentView === 'map' && (
                <MapScreen 
                  gameState={gameState}
                  selectLocation={selectLocation}
                  setView={setView}
                />
              )}
            </>
          )}
        </div>

        <div className="mt-6 bg-stone-900 p-4 rounded-lg border-2 border-yellow-600 shadow-xl">
          <p className="text-center text-yellow-400 text-sm">
            Jour {gameState.day} | {gameState.sect.name} | {gameState.player.cultivation} Niv.{gameState.player.cultivationLevel}
          </p>
        </div>
      </div>

      <CombatModal 
        gameState={gameState} 
        playerAttack={playerAttack} 
      />

      <RunEventModal 
        gameState={gameState} 
        handleEventChoice={handleEventChoice} 
        exitRun={exitRun} 
      />

      <TechniqueSelectionModal 
        showTechniqueSelection={gameState.showTechniqueSelection}
        playerTechniques={gameState.player.techniques}
        maxTechniques={gameState.player.maxTechniques}
        replaceTechnique={replaceTechnique}
        closeModal={closeTechniqueModal}
      />
    </div>
  );
}

export default App;
