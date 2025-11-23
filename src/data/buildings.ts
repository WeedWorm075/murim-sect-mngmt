import type { Building } from '../types/gameTypes';

export const buildings: Record<string, Building> = {
  cultivationHall: { 
    name: "Salle de Cultivation", 
    cost: 300, 
    qiCost: 200, 
    effect: "Cultivation +20%", 
    buildTime: 2 
  },
  library: { 
    name: "Bibliothèque", 
    cost: 400, 
    qiCost: 300, 
    effect: "Nouvelles techniques", 
    buildTime: 3 
  },
  garden: { 
    name: "Jardin Spirituel", 
    cost: 350, 
    qiCost: 250, 
    effect: "+50 Qi/jour", 
    buildTime: 2 
  },
  forge: { 
    name: "Forge Céleste", 
    cost: 500, 
    qiCost: 400, 
    effect: "Artefacts", 
    buildTime: 4 
  },
  studyHall: { 
    name: "Salle d'Étude", 
    cost: 400, 
    qiCost: 300, 
    effect: "+5 Persuasion/Discrétion", 
    buildTime: 3 
  }
};