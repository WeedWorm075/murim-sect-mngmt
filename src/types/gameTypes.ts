export interface Player {
  name: string;
  cultivation: string;
  cultivationLevel: number;
  cultivationProgress: number;
  qi: number;
  maxQi: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  persuasion: number;
  stealth: number;
  techniques: Technique[];
  maxTechniques: number;
  equipment: Equipment;
  inventory: Item[];
  learningTechnique: Technique | null;
}

export interface Technique {
  name: string;
  damage?: number;
  qiCost: number;
  type: 'attack' | 'defense';
  grade: string;
  element?: string;
  learnTime?: number;
  daysRemaining?: number;
}

export interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  accessory: Item | null;
}

export interface Item {
  id: number;
  name: string;
  type: 'weapon' | 'armor' | 'pill';
  grade: string;
  attack?: number;
  defense?: number;
  effect?: 'health' | 'qi' | 'stats' | 'cultivation';
  description: string;
}

export interface Sect {
  name: string;
  gold: number;
  spiritualQi: number;
  reputation: number;
  disciples: number;
  region: string;
  buildings: Buildings;
  resources: Resources;
  defenses: number;
  morale: number;
  buildingQueue: BuildingQueueItem[];
}

export interface Buildings {
  cultivationHall: number;
  library: number;
  garden: number;
  forge: number;
  studyHall: number;
}

export interface Resources {
  herbs: number;
  minerals: number;
  artifacts: number;
  scrolls: number;
}

export interface BuildingQueueItem {
  building: string;
  name: string;
  daysRemaining: number;
  targetLevel: number;
}

export interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  techniques: Technique[];
}

export interface Location {
  id: string;
  name: string;
  enemies: Enemy[];
  rewards: Rewards;
  icon: string;
}

export interface Rewards {
  gold: number;
  spiritualQi: number;
  reputation: number;
  herbs?: number;
  minerals?: number;
  artifacts?: number;
  scrolls?: number;
}

export interface GameState {
  player: Player;
  sect: Sect;
  currentView: string;
  inCombat: boolean;
  enemy: Enemy | null;
  combatLog: string[];
  day: number;
  actionsRemaining: number;
  notification: Notification | null;
  showInventory: boolean;
  inRun: boolean;
  runLevel: number;
  currentEvent: RunEvent | null;
  showTechniqueSelection: Technique | null;
  currentLocation?: Location;
}

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'breakthrough' | 'info';
}

export interface RunEvent {
  type: string;
  level: number;
}

export interface CultivationLevel {
  name: string;
  maxLevel: number;
  progressPerLevel: number;
}

export interface ItemGrade {
  name: string;
  color: string;
  bg: string;
  border: string;
  chance: number;
}

export interface EventType {
  name: string;
  icon: string;
  chance: number;
  minLevel: number;
  maxLevel: number;
}

export interface Building {
  name: string;
  cost: number;
  qiCost: number;
  effect: string;
  buildTime: number;
}