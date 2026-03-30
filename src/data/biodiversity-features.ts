export type BiodiversityType = 'pond' | 'wildflower_meadow' | 'bug_hotel' | 'bird_box' | 'orchard' | 'compost_heap' | 'log_pile' | 'compost_loo';

export interface BiodiversityFeature {
  id: BiodiversityType;
  name: string;
  sprite: string;
  description: string;
  cost: { seeds: number; compost: number };
  bonus: {
    type: 'pollinator' | 'pest_control' | 'seed_dispersal' | 'soil_health' | 'water';
    radius: number;      // how many adjacent cells are affected
    multiplier: number;  // growth speed multiplier (1.0 = no effect)
    description: string;
  };
  realWorldTip: string;
  funFact: string;
  unlockLevel: number;
}

export const biodiversityFeatures: BiodiversityFeature[] = [
  {
    id: 'pond',
    name: 'Wildlife Pond',
    sprite: '💧',
    description: 'A small pond that attracts frogs, newts, and dragonflies. Nearby plants benefit from the moisture and pollinators.',
    cost: { seeds: 20, compost: 10 },
    bonus: {
      type: 'pollinator',
      radius: 2,
      multiplier: 1.2,
      description: 'Nearby flowers and fruit grow 20% faster from pollinator activity',
    },
    realWorldTip: 'Even a washing-up bowl sunk into the ground can be a wildlife pond! Add a ramp so creatures can get in and out.',
    funFact: 'A single garden pond can support over 100 different species of wildlife including frogs, dragonflies, and water beetles!',
    unlockLevel: 2,
  },
  {
    id: 'wildflower_meadow',
    name: 'Wildflower Meadow',
    sprite: '🌸',
    description: 'A patch of native wildflowers that attracts bees, butterflies, and beneficial insects to your whole garden.',
    cost: { seeds: 15, compost: 5 },
    bonus: {
      type: 'pollinator',
      radius: 3,
      multiplier: 1.15,
      description: 'All plants within range get 15% growth bonus from increased pollination',
    },
    realWorldTip: 'Don\'t mow a patch of lawn and see what wildflowers appear! Native seeds are already in the soil waiting.',
    funFact: 'A single square metre of wildflower meadow can contain over 40 different plant species and support hundreds of insects!',
    unlockLevel: 1,
  },
  {
    id: 'bug_hotel',
    name: 'Bug Hotel',
    sprite: '🏨',
    description: 'A structure made from natural materials that provides shelter for beneficial insects like ladybirds and lacewings.',
    cost: { seeds: 10, compost: 8 },
    bonus: {
      type: 'pest_control',
      radius: 2,
      multiplier: 1.1,
      description: 'Reduces pest events for nearby plants. Ladybirds eat aphids!',
    },
    realWorldTip: 'Stack old pallets, stuff them with bamboo canes, pine cones, bark, and straw. Face the opening south for warmth!',
    funFact: 'A single ladybird can eat up to 5,000 aphids in its lifetime. Bug hotels give them a safe place to hibernate!',
    unlockLevel: 1,
  },
  {
    id: 'bird_box',
    name: 'Bird Box',
    sprite: '🐦',
    description: 'A nesting box for garden birds. Blue tits, robins, and wrens eat thousands of caterpillars and other pests.',
    cost: { seeds: 12, compost: 5 },
    bonus: {
      type: 'seed_dispersal',
      radius: 3,
      multiplier: 1.1,
      description: 'Small chance of free seeds each season from bird-dispersed plants',
    },
    realWorldTip: 'Mount bird boxes 2-4m high on a tree or wall, facing north-east to avoid strong sun and wet weather.',
    funFact: 'A pair of blue tits can eat 10,000 caterpillars while raising a single brood of chicks! They\'re incredible pest controllers.',
    unlockLevel: 2,
  },
  {
    id: 'compost_heap',
    name: 'Compost Heap',
    sprite: '♻️',
    description: 'Turn kitchen scraps and garden waste into rich compost. The foundation of no-dig growing!',
    cost: { seeds: 8, compost: 0 },
    bonus: {
      type: 'soil_health',
      radius: 2,
      multiplier: 1.2,
      description: 'Nearby no-dig beds get extra growth bonus. Generates free compost over time!',
    },
    realWorldTip: 'Layer green waste (kitchen scraps, grass) with brown waste (cardboard, dry leaves) for the best compost.',
    funFact: 'Compost heaps can reach temperatures of 60°C inside! That\'s hot enough to kill weed seeds and disease.',
    unlockLevel: 1,
  },
  {
    id: 'log_pile',
    name: 'Log Pile',
    sprite: '🪵',
    description: 'A stack of old logs providing habitat for beetles, woodlice, fungi, and hedgehogs.',
    cost: { seeds: 5, compost: 0 },
    bonus: {
      type: 'pest_control',
      radius: 1,
      multiplier: 1.05,
      description: 'Attracts ground beetles that eat slugs and snails',
    },
    realWorldTip: 'Leave fallen branches and logs in a quiet corner. As they rot, they create an amazing micro-ecosystem!',
    funFact: 'Dead wood supports over 1,700 species of invertebrate in the UK alone. It\'s one of the most important habitats you can create!',
    unlockLevel: 1,
  },
  {
    id: 'compost_loo',
    name: 'Compost Loo',
    sprite: '🚽',
    description: 'A composting toilet that turns human waste into safe, nutrient-rich compost over 1-2 years. Teaches the full nutrient cycle — what we eat from the garden returns to feed the garden!',
    cost: { seeds: 25, compost: 15 },
    bonus: {
      type: 'soil_health',
      radius: 0,
      multiplier: 1.0,
      description: 'Generates bonus compost each season. Teaches responsible waste management!',
    },
    realWorldTip: 'A compost toilet separates liquids and solids. Sawdust or wood shavings are added after each use to absorb moisture and control odour. After 12-18 months of composting, the result is safe, odourless humus that can be used around fruit trees and bushes.',
    funFact: 'The average person produces about 50kg of poo per year. A compost loo turns that into roughly 25kg of rich humus instead of flushing 15,000 litres of clean drinking water down a conventional toilet! In a world where fresh water is precious and sewage treatment uses huge amounts of energy, composting toilets are one of the most sustainable choices we can make.',
    unlockLevel: 4,
  },
];

export const biodiversityMap = new Map(biodiversityFeatures.map(f => [f.id, f]));

// Educational content for the Compost Loo feature
export const COMPOST_LOO_EDUCATIONAL = {
  title: 'The Compost Loo — Closing the Loop',
  intro: 'In nature, there is no such thing as waste. Every living thing that dies or produces waste becomes food for something else. A compost toilet helps us rejoin this natural cycle instead of breaking it.',
  howItWorks: [
    'You use the loo just like normal, but instead of flushing with water, you cover each deposit with a handful of sawdust, wood shavings, or dried leaves.',
    'Billions of tiny organisms (bacteria, fungi, and invertebrates) get to work breaking everything down — just like in a compost heap.',
    'After 12-18 months of composting, all harmful bacteria are destroyed by the natural heat and competition between microbes.',
    'What remains is dark, crumbly, odourless humus — pure plant food, rich in nitrogen, phosphorus, and potassium.',
  ],
  whyItMatters: [
    'A conventional flush toilet uses 6-13 litres of clean drinking water per flush — that\'s over 15,000 litres per person per year wasted!',
    'Sewage treatment plants use enormous amounts of energy and chemicals, and still release pollutants into rivers.',
    'The nutrients in human waste (nitrogen, phosphorus, potassium) are exactly what plants need to grow — flushing them away is literally flushing fertiliser down the drain.',
    'Composting toilets produce zero water pollution and create a valuable resource from what we normally consider waste.',
  ],
  safetyNote: 'Properly managed compost from a composting toilet is safe to use around fruit trees, bushes, and ornamental plants. The long composting time (12-18 months) and high temperatures destroy harmful pathogens. Always wash hands after handling any compost!',
};
