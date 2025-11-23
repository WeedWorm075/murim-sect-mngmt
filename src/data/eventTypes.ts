import type { EventType } from '../types/gameTypes';

export const eventTypes: Record<string, EventType> = {
  combat: { 
    name: "Combat", 
    icon: "⚔️", 
    chance: 0.30, 
    minLevel: 1, 
    maxLevel: 8 
  },
  treasure: { 
    name: "Trouvaille", 
    icon: "💎", 
    chance: 0.25, 
    minLevel: 1, 
    maxLevel: 9 
  },
  merchant: { 
    name: "Marchand", 
    icon: "🏪", 
    chance: 0.15, 
    minLevel: 2, 
    maxLevel: 7 
  },
  enlightenment: { 
    name: "Illumination", 
    icon: "✨", 
    chance: 0.05, 
    minLevel: 3, 
    maxLevel: 9 
  },
  technique: { 
    name: "Technique", 
    icon: "📜", 
    chance: 0.03, 
    minLevel: 4, 
    maxLevel: 9 
  },
  event: { 
    name: "Événement", 
    icon: "❓", 
    chance: 0.12, 
    minLevel: 1, 
    maxLevel: 9 
  }
};