export type BiodiversityType =
  | 'pond' | 'wildflower_meadow' | 'bug_hotel' | 'bird_box' | 'orchard'
  | 'compost_heap' | 'log_pile' | 'compost_loo'
  | 'polytunnel' | 'food_forest' | 'field_kitchen' | 'wash_pack_station' | 'cob_roundhouse';

export interface BiodiversityFeature {
  id: BiodiversityType;
  name: string;
  sprite: string;
  description: string;
  cost: { seeds: number; compost: number };
  bonus: {
    type: 'pollinator' | 'pest_control' | 'seed_dispersal' | 'soil_health' | 'water' | 'season_extend' | 'community' | 'harvest_value';
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
    id: 'polytunnel',
    name: 'Polytunnel',
    sprite: '🏗️',
    description: 'A covered growing space that extends your season by months. Grow tender crops year-round, start seeds earlier, and protect plants from harsh weather.',
    cost: { seeds: 40, compost: 20 },
    bonus: {
      type: 'season_extend',
      radius: 2,
      multiplier: 1.3,
      description: 'Plants inside grow 30% faster and are protected from frost and heavy rain',
    },
    realWorldTip: 'Even a simple hoop tunnel made from bent alkathene pipe and polythene sheeting can extend your growing season by 2-3 months. Start tomatoes, peppers, and cucumbers weeks earlier!',
    funFact: 'Charles Dowding grows over 100 different crops in his polytunnels at Homeacres. A single tunnel can produce enough salad leaves to feed 50 families!',
    unlockLevel: 3,
  },
  {
    id: 'food_forest',
    name: 'Food Forest',
    sprite: '🌳',
    description: 'A layered ecosystem of fruit trees, berry bushes, herbs, and ground cover that mimics a natural forest. Once established, it produces food with almost no work!',
    cost: { seeds: 50, compost: 25 },
    bonus: {
      type: 'pollinator',
      radius: 3,
      multiplier: 1.25,
      description: 'Massive biodiversity boost. Attracts pollinators, provides free fruit, and improves all nearby soil',
    },
    realWorldTip: 'Plant in layers: tall fruit trees (apple, pear), then smaller trees (plum, cherry), berry bushes (blackcurrant, gooseberry), herbs (comfrey, mint), and ground cover (strawberries, clover). Each layer supports the others!',
    funFact: 'A well-designed food forest can produce 5-10 times more food per square metre than a conventional farm, while actually improving the soil and biodiversity year on year. Some food forests in the UK are still producing after 20+ years with minimal maintenance!',
    unlockLevel: 4,
  },
  {
    id: 'field_kitchen',
    name: 'Field Kitchen',
    sprite: '🍳',
    description: 'A simple outdoor kitchen where harvests are turned into meals. Cook what you grow, share with your community, and learn about nutrition from field to fork!',
    cost: { seeds: 35, compost: 15 },
    bonus: {
      type: 'harvest_value',
      radius: 0,
      multiplier: 1.0,
      description: 'Doubles the XP from harvests. Teaches cooking with seasonal, home-grown ingredients!',
    },
    realWorldTip: 'The best meals use the freshest ingredients. A simple rocket stove made from bricks can be built in an afternoon and uses just twigs for fuel — perfect for a market garden.',
    funFact: 'Food loses up to 45% of its nutrients within 5 days of harvest. When you cook what you just picked, you get the maximum nutrition. A field kitchen turns your garden into the freshest restaurant in the world!',
    unlockLevel: 4,
  },
  {
    id: 'wash_pack_station',
    name: 'Wash & Pack Station',
    sprite: '📦',
    description: 'Where harvests are washed, weighed, and packed into veg boxes for the community. The heart of a working market garden!',
    cost: { seeds: 30, compost: 10 },
    bonus: {
      type: 'harvest_value',
      radius: 0,
      multiplier: 1.0,
      description: 'Earn bonus seeds from harvests as you pack veg boxes for the community',
    },
    realWorldTip: 'A simple outdoor tap, a few washing-up bowls, and a table is all you need. Wash roots gently, dry salads in a spinner, and pack into boxes by weight. Label everything — your customers will love knowing exactly what they\'re eating!',
    funFact: 'A single 1-acre market garden using no-dig methods can produce enough vegetables to fill 50-80 veg boxes per week, feeding up to 100 local families with fresh, seasonal food. That\'s real food security!',
    unlockLevel: 5,
  },
  {
    id: 'cob_roundhouse',
    name: 'Cob Roundhouse',
    sprite: '🛖',
    description: 'A beautiful natural building made from earth, straw, and water. The community gathering space for workshops, celebrations, seed swaps, and education events.',
    cost: { seeds: 60, compost: 30 },
    bonus: {
      type: 'community',
      radius: 0,
      multiplier: 1.0,
      description: 'Unlocks community events! Host workshops, celebrations, and connect with local growers',
    },
    realWorldTip: 'Cob building uses subsoil, straw, and water — all free or nearly free materials. A group of volunteers can build a small roundhouse in a weekend. It\'s one of the most ancient and sustainable building techniques on Earth!',
    funFact: 'Cob buildings can last hundreds of years. The oldest cob houses in Devon, England are over 500 years old and still lived in today. Natural buildings breathe, regulate temperature, and create zero waste — the perfect gathering space for a community garden!',
    unlockLevel: 5,
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
