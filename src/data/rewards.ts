export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'digital' | 'real-world';
  category: 'seeds' | 'tools' | 'decoration' | 'expansion' | 'knowledge';
  cost: number; // in harvest points
  sprite: string;
  available: boolean;
}

export const rewards: Reward[] = [
  // DIGITAL REWARDS
  {
    id: 'extra_plot',
    name: 'Garden Expansion',
    description: 'Unlock 2 extra rows for your garden grid!',
    type: 'digital',
    category: 'expansion',
    cost: 50,
    sprite: '🔲',
    available: true,
  },
  {
    id: 'golden_watering_can',
    name: 'Golden Watering Can',
    description: 'Waters plants in a 3x3 area instead of just one!',
    type: 'digital',
    category: 'tools',
    cost: 80,
    sprite: '🏆',
    available: true,
  },
  {
    id: 'seasonal_seeds_pack',
    name: 'Seasonal Seed Pack',
    description: 'Unlock 3 special seasonal plant varieties!',
    type: 'digital',
    category: 'seeds',
    cost: 40,
    sprite: '🎁',
    available: true,
  },
  {
    id: 'garden_gnome',
    name: 'Pixel Garden Gnome',
    description: 'A decorative gnome for your garden. Purely delightful!',
    type: 'digital',
    category: 'decoration',
    cost: 20,
    sprite: '🧙',
    available: true,
  },
  // REAL-WORLD REWARDS (placeholders for future partner integration)
  {
    id: 'real_seed_pack',
    name: 'Real Seed Packet',
    description: 'Earn a real packet of seeds delivered to your door! Grow what you learned in the game.',
    type: 'real-world',
    category: 'seeds',
    cost: 200,
    sprite: '🌱',
    available: false,
  },
  {
    id: 'real_trowel',
    name: 'Real Garden Trowel',
    description: 'A proper hand trowel to start your real-world growing journey.',
    type: 'real-world',
    category: 'tools',
    cost: 500,
    sprite: '🔧',
    available: false,
  },
  {
    id: 'real_growing_kit',
    name: 'Starter Growing Kit',
    description: 'A complete kit with pots, compost, seeds, and growing guide!',
    type: 'real-world',
    category: 'tools',
    cost: 1000,
    sprite: '📦',
    available: false,
  },
  {
    id: 'growing_guide_book',
    name: 'Growing Guide eBook',
    description: 'A digital guide with everything you learned in WildGrow, plus more!',
    type: 'real-world',
    category: 'knowledge',
    cost: 150,
    sprite: '📚',
    available: false,
  },
];

export const rewardMap = new Map(rewards.map(r => [r.id, r]));
