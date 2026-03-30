export type BiodiversityType = 'pond' | 'wildflower_meadow' | 'bug_hotel' | 'bird_box' | 'orchard' | 'compost_heap' | 'log_pile';

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
];

export const biodiversityMap = new Map(biodiversityFeatures.map(f => [f.id, f]));
