export type QuestType = 'digital' | 'bridge' | 'real-world';
export type QuestCategory = 'growing' | 'biodiversity' | 'community' | 'seasonal';

export interface QuestTask {
  id: string;
  description: string;
  target: number;
  current?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  tasks: QuestTask[];
  rewardXP: number;
  rewardSeeds: number;
  rewardCompost: number;
  educationalContent: string;
  unlockLevel: number;
}

export const quests: Quest[] = [
  // DIGITAL QUESTS - Learn basics in-game
  {
    id: 'first_seed',
    title: 'First Seed',
    description: 'Plant your very first seed and watch it grow!',
    type: 'digital',
    category: 'growing',
    tasks: [{ id: 'plant_1', description: 'Plant any seed', target: 1 }],
    rewardXP: 10,
    rewardSeeds: 5,
    rewardCompost: 3,
    educationalContent: 'Every garden starts with a single seed. Seeds contain everything a plant needs to begin growing - just add water and sunlight!',
    unlockLevel: 0,
  },
  {
    id: 'water_wise',
    title: 'Water Wise',
    description: 'Water your plants to help them grow strong.',
    type: 'digital',
    category: 'growing',
    tasks: [{ id: 'water_5', description: 'Water plants 5 times', target: 5 }],
    rewardXP: 15,
    rewardSeeds: 3,
    rewardCompost: 2,
    educationalContent: 'Plants drink water through their roots. Water in the morning so plants can drink all day, and water the soil not the leaves!',
    unlockLevel: 0,
  },
  {
    id: 'first_harvest',
    title: 'First Harvest',
    description: 'Grow a plant all the way to harvest!',
    type: 'digital',
    category: 'growing',
    tasks: [{ id: 'harvest_1', description: 'Harvest any plant', target: 1 }],
    rewardXP: 20,
    rewardSeeds: 8,
    rewardCompost: 5,
    educationalContent: 'Harvesting at the right time matters. Pick vegetables when they are firm and colourful. Taste the difference between shop-bought and home-grown!',
    unlockLevel: 1,
  },
  {
    id: 'companion_friends',
    title: 'Companion Friends',
    description: 'Plant two companion plants next to each other.',
    type: 'digital',
    category: 'growing',
    tasks: [{ id: 'companion_pair', description: 'Create a companion planting pair', target: 1 }],
    rewardXP: 25,
    rewardSeeds: 5,
    rewardCompost: 5,
    educationalContent: 'Companion planting is nature\'s teamwork! Some plants help each other grow by repelling pests, attracting pollinators, or adding nutrients to the soil.',
    unlockLevel: 1,
  },
  {
    id: 'no_dig_hero',
    title: 'No-Dig Hero',
    description: 'Create your first no-dig bed with mulch and compost.',
    type: 'digital',
    category: 'growing',
    tasks: [{ id: 'mulch_bed', description: 'Apply mulch to a bed', target: 1 }, { id: 'compost_bed', description: 'Add compost to a bed', target: 1 }],
    rewardXP: 30,
    rewardSeeds: 5,
    rewardCompost: 10,
    educationalContent: 'No-dig gardening was popularised by Charles Dowding. Instead of digging, you add compost on top. This protects soil life - worms, fungi, and billions of microbes that help plants grow!',
    unlockLevel: 2,
  },
  {
    id: 'biodiversity_builder',
    title: 'Biodiversity Builder',
    description: 'Add your first wildlife feature to help nature thrive.',
    type: 'digital',
    category: 'biodiversity',
    tasks: [{ id: 'add_feature', description: 'Build any biodiversity feature', target: 1 }],
    rewardXP: 25,
    rewardSeeds: 5,
    rewardCompost: 5,
    educationalContent: 'Biodiversity means having lots of different living things. A garden with ponds, wildflowers, and bug homes grows better food because nature is in balance!',
    unlockLevel: 2,
  },
  {
    id: 'pollinator_paradise',
    title: 'Pollinator Paradise',
    description: 'Plant flowers that attract bees and butterflies.',
    type: 'digital',
    category: 'biodiversity',
    tasks: [{ id: 'plant_flowers_3', description: 'Plant 3 different flowers', target: 3 }],
    rewardXP: 30,
    rewardSeeds: 8,
    rewardCompost: 5,
    educationalContent: 'One in three bites of food you eat depends on pollinators! Bees, butterflies, and hoverflies carry pollen between flowers so fruit and vegetables can form.',
    unlockLevel: 2,
  },
  // BRIDGE QUESTS - Start connecting to real world
  {
    id: 'window_sill_challenge',
    title: 'Window Sill Challenge',
    description: 'Can you grow something for real? Start with a seed on your window sill!',
    type: 'bridge',
    category: 'growing',
    tasks: [{ id: 'real_plant', description: 'Plant a real seed (take a photo!)', target: 1 }],
    rewardXP: 50,
    rewardSeeds: 15,
    rewardCompost: 10,
    educationalContent: 'Growing for real is the ultimate adventure! Start with something easy like cress, radishes, or sunflowers. All you need is a pot, some compost, seeds, and water.',
    unlockLevel: 3,
  },
  {
    id: 'nature_detective',
    title: 'Nature Detective',
    description: 'Go outside and spot 5 different living things in your garden or local park.',
    type: 'bridge',
    category: 'biodiversity',
    tasks: [{ id: 'spot_species', description: 'Record 5 living things you spotted', target: 5 }],
    rewardXP: 40,
    rewardSeeds: 10,
    rewardCompost: 5,
    educationalContent: 'Nature is everywhere, even in cities! Look for birds, insects, wildflowers, fungi, and trees. The more you look, the more you\'ll discover.',
    unlockLevel: 3,
  },
  {
    id: 'seasonal_explorer',
    title: 'Seasonal Explorer',
    description: 'Notice what\'s happening in nature this season. What\'s flowering? What\'s fruiting?',
    type: 'bridge',
    category: 'seasonal',
    tasks: [{ id: 'season_obs', description: 'Record a seasonal observation', target: 1 }],
    rewardXP: 35,
    rewardSeeds: 8,
    rewardCompost: 5,
    educationalContent: 'Real farmers and growers pay close attention to the seasons. Knowing when to plant, grow, and harvest is the most important skill in growing food.',
    unlockLevel: 3,
  },
];

export const questMap = new Map(quests.map(q => [q.id, q]));
