import type { ItemGrade } from '../types/gameTypes';

export const itemGrades: Record<string, ItemGrade> = {
  human: { 
    name: "Humain", 
    color: "text-gray-700", 
    bg: "bg-gray-100", 
    border: "border-gray-400", 
    chance: 0.50 
  },
  earth: { 
    name: "Terre", 
    color: "text-green-700", 
    bg: "bg-green-100", 
    border: "border-green-500", 
    chance: 0.30 
  },
  heaven: { 
    name: "Céleste", 
    color: "text-blue-700", 
    bg: "bg-blue-100", 
    border: "border-blue-500", 
    chance: 0.15 
  },
  immortal: { 
    name: "Immortel", 
    color: "text-purple-700", 
    bg: "bg-purple-100", 
    border: "border-purple-500", 
    chance: 0.05 
  }
};