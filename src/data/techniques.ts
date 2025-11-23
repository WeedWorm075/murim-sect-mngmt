import type { Technique } from '../types/gameTypes';

export const baseTechniques: Technique[] = [
  { 
    name: "Poing du Dragon", 
    damage: 25, 
    qiCost: 15, 
    type: "attack", 
    grade: "human" 
  },
  { 
    name: "Garde de Fer", 
    defense: 20, 
    qiCost: 10, 
    type: "defense", 
    grade: "human" 
  },
  { 
    name: "Frappe Basique", 
    damage: 15, 
    qiCost: 0, 
    type: "attack", 
    grade: "human" 
  }
];

export const techniqueElements = [
  'Feu', 'Eau', 'Terre', 'Métal', 'Bois', 'Foudre', 'Vent'
];

export const techniqueNames = [
  'Paume du',
  'Épée du',
  'Poing du',
  'Déferlante du',
  'Souffle du'
];