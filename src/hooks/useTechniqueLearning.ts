import { useState } from 'react';
import type { GameState, Technique } from '../types/gameTypes';

export const useTechniqueLearning = (gameState: GameState, setGameState: any, showNotification: any) => {
  const [learningProgress, setLearningProgress] = useState<{[key: string]: number}>({});

  const startLearning = (technique: Technique) => {
    setGameState((prev: GameState) => ({
      ...prev,
      player: {
        ...prev.player,
        learningTechnique: technique
      }
    }));
    setLearningProgress(prev => ({
      ...prev,
      [technique.name]: 0
    }));
    showNotification(`Commence l'apprentissage de ${technique.name}`, "info");
  };

  const practiceTechnique = (technique: Technique, method: string, cost: number, progress: number) => {
    const currentProgress = learningProgress[technique.name] || 0;
    const requiredProgress = technique.learnTime ? technique.learnTime * 50 : 100; // Base 100 progress
    
    if (gameState.player.qi < cost) {
      showNotification("Qi insuffisant pour pratiquer!", "error");
      return false;
    }

    const newProgress = Math.min(currentProgress + progress, requiredProgress);
    setLearningProgress(prev => ({
      ...prev,
      [technique.name]: newProgress
    }));

    setGameState((prev: GameState) => ({
      ...prev,
      player: {
        ...prev.player,
        qi: prev.player.qi - cost
      }
    }));

    if (newProgress >= requiredProgress) {
      completeLearning(technique);
      showNotification(`${technique.name} maîtrisée!`, "success");
      return true;
    } else {
      const percentage = Math.floor((newProgress / requiredProgress) * 100);
      showNotification(`Progrès: +${progress} (${percentage}%)`, "info");
      return false;
    }
  };

  const completeLearning = (technique: Technique) => {
    const learnedTech = { ...technique };
    delete learnedTech.learnTime;
    delete learnedTech.daysRemaining;

    setGameState((prev: GameState) => ({
      ...prev,
      player: {
        ...prev.player,
        techniques: [...prev.player.techniques, learnedTech],
        learningTechnique: null
      }
    }));

    setLearningProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[technique.name];
      return newProgress;
    });
  };

  const getLearningProgress = (techniqueName: string) => {
    return learningProgress[techniqueName] || 0;
  };

  const getRequiredProgress = (technique: Technique) => {
    return technique.learnTime ? technique.learnTime * 50 : 100;
  };

  return {
    startLearning,
    practiceTechnique,
    getLearningProgress,
    getRequiredProgress,
    learningProgress
  };
};