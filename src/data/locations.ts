export const locations = [
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
  },
  {
    id: "merchant",
    name: "Marchand Itinérant",
    type: "merchant",
    description: "Un marchand propose ses marchandises",
    icon: "🏪",
    enemies: [],
    rewards: {}
  }
];