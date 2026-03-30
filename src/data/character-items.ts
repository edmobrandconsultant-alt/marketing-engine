export type ItemCategory = 'hat' | 'outfit' | 'tool' | 'accessory' | 'seeds' | 'special';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface UnlockCondition {
  type: 'level' | 'harvest' | 'gardenStage' | 'plantTrees' | 'questsComplete' | 'soilHealth' | 'compost' | 'starter' | 'secret';
  threshold: number;
  description: string;
}

export interface CharacterItem {
  id: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  description: string;
  rarity: ItemRarity;
  unlockCondition: UnlockCondition;
  flavorText: string;
}

export const characterItems: CharacterItem[] = [
  // ─── HATS ──────────────────────────────────────────────
  {
    id: 'straw_sun_hat',
    name: 'Straw Sun Hat',
    emoji: '👒',
    category: 'hat',
    description: 'A wide-brimmed hat woven from golden straw, perfect for long days in the garden.',
    rarity: 'common',
    unlockCondition: { type: 'level', threshold: 1, description: 'Reach level 1' },
    flavorText: 'Real growers know: a good hat is as essential as a good trowel. Keeps the sun off your neck and the rain out of your eyes!',
  },
  {
    id: 'mushroom_cap_hat',
    name: 'Mushroom Cap Hat',
    emoji: '🍄',
    category: 'hat',
    description: 'A whimsical hat shaped like a fly agaric mushroom cap, spotted with white flecks.',
    rarity: 'uncommon',
    unlockCondition: { type: 'level', threshold: 3, description: 'Reach level 3' },
    flavorText: 'Fungi are the hidden network beneath every healthy garden. Mycorrhizal fungi connect plant roots together, sharing nutrients like an underground internet!',
  },
  {
    id: 'beekeepers_veil',
    name: "Beekeeper's Veil",
    emoji: '🐝',
    category: 'hat',
    description: 'A netted hat that protects your face while tending to the pollinators.',
    rarity: 'rare',
    unlockCondition: { type: 'level', threshold: 5, description: 'Reach level 5' },
    flavorText: 'A single honeybee visits 50-100 flowers in one foraging trip. Without bees, we would lose a third of all the food we eat!',
  },
  {
    id: 'flower_crown',
    name: 'Flower Crown',
    emoji: '💐',
    category: 'hat',
    description: 'A delicate crown woven from fresh wildflowers — cornflowers, poppies, and ox-eye daisies.',
    rarity: 'uncommon',
    unlockCondition: { type: 'harvest', threshold: 20, description: 'Harvest 20 plants' },
    flavorText: 'Wildflower meadows support over 1,400 species of invertebrates. A single square metre can contain 40 different plant species!',
  },
  {
    id: 'wicker_visor',
    name: 'Wicker Visor',
    emoji: '🧢',
    category: 'hat',
    description: 'A lightweight willow-woven visor, handcrafted by a local basketmaker.',
    rarity: 'common',
    unlockCondition: { type: 'level', threshold: 2, description: 'Reach level 2' },
    flavorText: 'Willow is one of the fastest-growing trees in Britain. It can be coppiced (cut back) every year, and the stems used for baskets, fences, and garden structures.',
  },

  // ─── OUTFITS ───────────────────────────────────────────
  {
    id: 'muddy_wellies',
    name: 'Muddy Wellies',
    emoji: '🥾',
    category: 'outfit',
    description: 'A trusty pair of rubber boots, already caked in good honest mud.',
    rarity: 'common',
    unlockCondition: { type: 'starter', threshold: 0, description: 'Starting item' },
    flavorText: 'The best sign of a good gardener? Mud on their boots! Healthy soil is teeming with life — a teaspoon contains more organisms than there are people on Earth.',
  },
  {
    id: 'linen_apron',
    name: 'Linen Apron',
    emoji: '👔',
    category: 'outfit',
    description: 'A sturdy linen apron with deep pockets for seeds, twine, and the odd snail.',
    rarity: 'common',
    unlockCondition: { type: 'level', threshold: 2, description: 'Reach level 2' },
    flavorText: 'Linen is made from flax, one of the oldest cultivated crops in the world. It gets softer with every wash and lasts for decades!',
  },
  {
    id: 'market_gardener_overalls',
    name: "Market Gardener's Overalls",
    emoji: '🧑‍🌾',
    category: 'outfit',
    description: 'Practical dungarees with reinforced knees — built for hours of planting and harvesting.',
    rarity: 'uncommon',
    unlockCondition: { type: 'gardenStage', threshold: 3, description: 'Reach garden stage 3' },
    flavorText: 'A market gardener can grow enough food on a quarter acre to feed 40 families. It is one of the most productive forms of farming in the world!',
  },
  {
    id: 'dowdings_signature_fleece',
    name: "Dowding's Signature Fleece",
    emoji: '🧥',
    category: 'outfit',
    description: 'A warm fleece in the style favoured by the legendary no-dig pioneer Charles Dowding.',
    rarity: 'rare',
    unlockCondition: { type: 'level', threshold: 7, description: 'Reach level 7' },
    flavorText: 'Charles Dowding has been growing no-dig since 1983. His garden at Homeacres in Somerset produces over 1 tonne of veg per year from just 40 beds!',
  },
  {
    id: 'earth_guardian_cloak',
    name: 'Earth Guardian Cloak',
    emoji: '🌍',
    category: 'outfit',
    description: 'A flowing cloak the colour of rich soil, embroidered with leaves and roots. Worn by those who truly understand the land.',
    rarity: 'legendary',
    unlockCondition: { type: 'level', threshold: 10, description: 'Reach level 10' },
    flavorText: 'Regenerative farming can reverse climate change by drawing carbon from the air and storing it in healthy soil. Every grower is an Earth Guardian!',
  },
  {
    id: 'seed_saver_smock',
    name: "Seed Saver's Smock",
    emoji: '👘',
    category: 'outfit',
    description: 'A traditional smock with embroidered seed motifs, worn by heritage seed collectors.',
    rarity: 'uncommon',
    unlockCondition: { type: 'harvest', threshold: 25, description: 'Harvest 25 plants' },
    flavorText: 'We have lost 75% of crop diversity since 1900. Seed savers keep ancient varieties alive — every saved seed is a piece of living history.',
  },

  // ─── TOOLS ─────────────────────────────────────────────
  {
    id: 'wooden_dibber',
    name: 'Wooden Dibber',
    emoji: '🪵',
    category: 'tool',
    description: 'A simple pointed stick for making seed holes — the oldest tool in gardening.',
    rarity: 'common',
    unlockCondition: { type: 'starter', threshold: 0, description: 'Starting item' },
    flavorText: 'A dibber is just a pointed stick, but it is one of the most useful tools in any garden. Charles Dowding uses one every day for transplanting seedlings!',
  },
  {
    id: 'copper_trowel',
    name: 'Copper Trowel',
    emoji: '🥄',
    category: 'tool',
    description: 'A beautiful hand-forged copper trowel that never rusts and improves with age.',
    rarity: 'uncommon',
    unlockCondition: { type: 'level', threshold: 3, description: 'Reach level 3' },
    flavorText: 'Copper tools do not disturb the electromagnetic field of the soil, and some gardeners believe they repel slugs. They also develop a gorgeous green patina over time!',
  },
  {
    id: 'hand_forged_hori_hori',
    name: 'Hand-forged Hori Hori',
    emoji: '🗡️',
    category: 'tool',
    description: 'A Japanese soil knife with a serrated edge — part trowel, part blade, all purpose.',
    rarity: 'rare',
    unlockCondition: { type: 'level', threshold: 6, description: 'Reach level 6' },
    flavorText: 'The hori hori (meaning "dig dig" in Japanese) is a multi-purpose garden knife. It can dig, cut roots, divide plants, and even measure planting depth with its marked blade!',
  },
  {
    id: 'carved_walking_stick',
    name: 'Carved Walking Stick',
    emoji: '🦯',
    category: 'tool',
    description: 'A hazel walking stick carved with leaf patterns, used for surveying the land and poking at interesting fungi.',
    rarity: 'rare',
    unlockCondition: { type: 'plantTrees', threshold: 50, description: 'Plant 50 trees or features' },
    flavorText: 'Hazel coppice is one of the most ancient forms of woodland management in Britain. A hazel stool can live for hundreds of years if regularly cut back!',
  },
  {
    id: 'handmade_willow_basket',
    name: 'Handmade Willow Basket',
    emoji: '🧺',
    category: 'tool',
    description: 'A beautiful trug basket woven from Somerset willow — perfect for carrying the harvest home.',
    rarity: 'uncommon',
    unlockCondition: { type: 'harvest', threshold: 30, description: 'Harvest 30 plants' },
    flavorText: 'Willow baskets (trugs) have been used for harvesting for thousands of years. The Somerset Levels are famous for their willow beds, where basket-making is a living tradition.',
  },
  {
    id: 'brass_watering_rose',
    name: 'Brass Watering Rose',
    emoji: '🚿',
    category: 'tool',
    description: 'A fine brass rose attachment for your watering can — gives a gentle shower that seedlings love.',
    rarity: 'common',
    unlockCondition: { type: 'level', threshold: 2, description: 'Reach level 2' },
    flavorText: 'A good watering rose turns a stream of water into a gentle rain. This stops soil from compacting and prevents tiny seedlings from being washed away!',
  },

  // ─── ACCESSORIES ───────────────────────────────────────
  {
    id: 'silver_leaf_pendant',
    name: 'Handmade Silver Leaf Pendant',
    emoji: '🍃',
    category: 'accessory',
    description: 'A delicate pendant cast from a real oak leaf in recycled silver.',
    rarity: 'rare',
    unlockCondition: { type: 'level', threshold: 8, description: 'Reach level 8' },
    flavorText: 'A single oak tree supports over 2,300 species of wildlife. Oaks can live for over 1,000 years, providing food and shelter for countless generations.',
  },
  {
    id: 'seed_saving_pouch',
    name: 'Seed Saving Pouch',
    emoji: '👝',
    category: 'accessory',
    description: 'A waxed cotton pouch with labelled compartments for saving seeds from your best plants.',
    rarity: 'uncommon',
    unlockCondition: { type: 'level', threshold: 4, description: 'Reach level 4' },
    flavorText: 'Saving seeds from your best plants each year means your garden adapts to your local climate and soil. After a few generations, seeds become perfectly suited to your patch!',
  },
  {
    id: 'woven_bark_bracelet',
    name: 'Woven Bark Bracelet',
    emoji: '🪢',
    category: 'accessory',
    description: 'A bracelet braided from thin strips of birch bark — light, strong, and beautifully natural.',
    rarity: 'common',
    unlockCondition: { type: 'level', threshold: 2, description: 'Reach level 2' },
    flavorText: 'Birch bark has been used by humans for thousands of years — for writing, building, and even making waterproof containers. It is nature\'s own wrapping paper!',
  },
  {
    id: 'pressed_flower_bookmark',
    name: 'Pressed Flower Bookmark',
    emoji: '🔖',
    category: 'accessory',
    description: 'A laminated bookmark containing real pressed wildflowers — clover, buttercup, and forget-me-not.',
    rarity: 'common',
    unlockCondition: { type: 'harvest', threshold: 10, description: 'Harvest 10 plants' },
    flavorText: 'Pressing flowers is one of the oldest ways to preserve nature\'s beauty. Victorian gardeners kept entire albums of pressed specimens to record what grew in their gardens!',
  },
  {
    id: 'robin_feather_pin',
    name: 'Robin Feather Pin',
    emoji: '🪶',
    category: 'accessory',
    description: 'A tiny enamel pin shaped like a robin\'s breast feather — the gardener\'s best friend.',
    rarity: 'uncommon',
    unlockCondition: { type: 'level', threshold: 5, description: 'Reach level 5' },
    flavorText: 'Robins follow gardeners because digging (or composting!) disturbs the soil and reveals worms and insects. They are the most confident of all British birds!',
  },

  // ─── SEEDS ─────────────────────────────────────────────
  {
    id: 'heirloom_tomato_seeds',
    name: 'Packet of Heirloom Tomato Seeds',
    emoji: '🍅',
    category: 'seeds',
    description: 'Seeds from a heritage variety of tomato — Brandywine, passed down through generations of growers.',
    rarity: 'uncommon',
    unlockCondition: { type: 'harvest', threshold: 15, description: 'Harvest 15 plants' },
    flavorText: 'Heirloom tomatoes come in every colour — red, yellow, purple, green, even striped! Brandywine was first grown by Amish farmers in the 1880s and is still one of the tastiest varieties.',
  },
  {
    id: 'plug_plants_tray',
    name: 'Tray of Plug Plants',
    emoji: '🌱',
    category: 'seeds',
    description: 'A module tray of young seedlings ready to transplant — lettuce, chard, and kale.',
    rarity: 'rare',
    unlockCondition: { type: 'gardenStage', threshold: 4, description: 'Reach garden stage 4' },
    flavorText: 'Charles Dowding starts nearly all his plants as modules in the potting shed. This gives them a head start and means fewer gaps in the beds!',
  },
  {
    id: 'heritage_apple_cutting',
    name: 'Ancient Heritage Apple Cutting',
    emoji: '🍎',
    category: 'seeds',
    description: 'A grafted cutting from a 200-year-old heritage apple tree — a living piece of history.',
    rarity: 'legendary',
    unlockCondition: { type: 'gardenStage', threshold: 5, description: 'Reach garden stage 5' },
    flavorText: 'Britain once had over 2,000 named apple varieties! Many are now rare or lost. Heritage orchards preserve this incredible diversity — every apple has a story.',
  },
  {
    id: 'wildflower_seed_bomb',
    name: 'Wildflower Seed Bomb',
    emoji: '💣',
    category: 'seeds',
    description: 'A ball of clay, compost, and native wildflower seeds — just throw and grow!',
    rarity: 'common',
    unlockCondition: { type: 'level', threshold: 1, description: 'Reach level 1' },
    flavorText: 'Seed bombs were popularised by Japanese farmer Masanobu Fukuoka. They protect seeds from birds and give them a boost of compost to start growing in bare ground!',
  },
  {
    id: 'purple_sprouting_broccoli',
    name: 'Purple Sprouting Broccoli Seeds',
    emoji: '🥦',
    category: 'seeds',
    description: 'Seeds for the king of the spring harvest — purple sprouting broccoli takes patience but rewards generously.',
    rarity: 'uncommon',
    unlockCondition: { type: 'level', threshold: 4, description: 'Reach level 4' },
    flavorText: 'Purple sprouting broccoli is planted in summer and harvested the following spring. It teaches the greatest lesson in gardening: patience! Good things come to those who wait.',
  },

  // ─── SPECIAL ───────────────────────────────────────────
  {
    id: 'golden_spade_badge',
    name: 'Golden Spade Badge',
    emoji: '🏅',
    category: 'special',
    description: 'A gleaming golden spade pin — the highest honour for a grower who has completed every quest.',
    rarity: 'legendary',
    unlockCondition: { type: 'questsComplete', threshold: 999, description: 'Complete all quests' },
    flavorText: 'The golden spade represents mastery of the growing arts. From seed to harvest, from soil to table — you have learned it all!',
  },
  {
    id: 'soil_whisperers_monocle',
    name: "Soil Whisperer's Monocle",
    emoji: '🧐',
    category: 'special',
    description: 'A brass monocle that lets you see the hidden world of soil biology — mycorrhizal networks, bacteria, and nematodes.',
    rarity: 'legendary',
    unlockCondition: { type: 'soilHealth', threshold: 10, description: 'Max soil health on 10 plots' },
    flavorText: 'Healthy soil is alive! In a single handful there are more microorganisms than people who have ever lived. The soil food web is the foundation of all terrestrial life.',
  },
  {
    id: 'charles_dowding_autograph',
    name: 'Charles Dowding Autograph',
    emoji: '✍️',
    category: 'special',
    description: 'A signed card from Charles Dowding himself: "No dig, no problem! Keep composting."',
    rarity: 'legendary',
    unlockCondition: { type: 'compost', threshold: 5, description: 'Apply compost 5 times (secret!)' },
    flavorText: 'Charles Dowding is a pioneer of no-dig gardening in the UK. His YouTube channel has inspired millions to grow food without disturbing the soil. Compost is the answer to almost every garden question!',
  },
  {
    id: 'solstice_lantern',
    name: 'Solstice Lantern',
    emoji: '🏮',
    category: 'special',
    description: 'A handmade paper lantern decorated with pressed leaves, lit on the longest day of the year.',
    rarity: 'rare',
    unlockCondition: { type: 'level', threshold: 6, description: 'Reach level 6' },
    flavorText: 'The summer solstice (around June 21st) gives us the most daylight hours — and the most growing time! Many growers celebrate with garden gatherings and shared meals.',
  },
];

export function getItemById(id: string): CharacterItem | undefined {
  return characterItems.find(item => item.id === id);
}

export const itemsByCategory: Record<ItemCategory, CharacterItem[]> = {
  hat: characterItems.filter(i => i.category === 'hat'),
  outfit: characterItems.filter(i => i.category === 'outfit'),
  tool: characterItems.filter(i => i.category === 'tool'),
  accessory: characterItems.filter(i => i.category === 'accessory'),
  seeds: characterItems.filter(i => i.category === 'seeds'),
  special: characterItems.filter(i => i.category === 'special'),
};

export interface CharacterState {
  unlockedItems: string[];
  equippedItems: {
    hat: string | null;
    outfit: string | null;
    tool: string | null;
    accessory: string | null;
  };
}

/**
 * Returns items that a player has unlocked based on their game state.
 */
export function getUnlockedItems(state: {
  level: number;
  totalHarvests: number;
  gardenStageId: number;
  totalPlanted: number;
  completedQuestIds: string[];
  grid: { soilHealth: { fertility: number; moisture: number; biology: number }; featureId: string | null }[][];
  compostApplications?: number;
}): string[] {
  const totalQuests = state.completedQuestIds.length;
  const maxSoilPlots = state.grid.flat().filter(cell => {
    if (cell.featureId) return false;
    const sh = cell.soilHealth;
    return sh.fertility >= 100 && sh.moisture >= 100 && sh.biology >= 100;
  }).length;
  // Count features as "trees/features planted"
  const featuresBuilt = state.grid.flat().filter(c => c.featureId !== null).length;

  return characterItems
    .filter(item => {
      const cond = item.unlockCondition;
      switch (cond.type) {
        case 'starter':
          return true;
        case 'level':
          return state.level >= cond.threshold;
        case 'harvest':
          return state.totalHarvests >= cond.threshold;
        case 'gardenStage':
          return state.gardenStageId >= cond.threshold;
        case 'plantTrees':
          return featuresBuilt >= cond.threshold;
        case 'questsComplete':
          return totalQuests >= cond.threshold;
        case 'soilHealth':
          return maxSoilPlots >= cond.threshold;
        case 'compost':
          return (state.compostApplications ?? 0) >= cond.threshold;
        case 'secret':
          return (state.compostApplications ?? 0) >= cond.threshold;
        default:
          return false;
      }
    })
    .map(item => item.id);
}
