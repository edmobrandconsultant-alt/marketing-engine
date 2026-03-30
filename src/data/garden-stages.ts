/**
 * Garden Expansion Stages
 *
 * Progression from a small backyard plot to a full 1-acre market garden.
 * Based on a real market garden layout:
 *
 *   [Wildflower Meadow & Food Forest]   ← Stage 5
 *   [Compost Loo]
 *   [Ponds & Habitat Area]              ← Stage 3
 *   [Market Garden Beds]                ← Stage 2
 *   [Compost Bins]
 *   [Polytunnel]                        ← Stage 3
 *   [Wash & Pack] [Field Kitchen]       ← Stage 4
 *   [Cob Roundhouse / Yurt]            ← Stage 5
 *   [Entrance & Parking]
 */

export interface GardenStage {
  id: number;
  name: string;
  description: string;
  gridRows: number;
  gridCols: number;
  levelRequired: number;
  harvestsRequired: number;
  unlockMessage: string;
  /** Which features become available to build at this stage */
  unlocksFeatures: string[];
  /** Educational note about real market garden development */
  realWorldNote: string;
}

export const gardenStages: GardenStage[] = [
  {
    id: 1,
    name: 'Backyard Plot',
    description: 'A small patch of earth — everyone starts somewhere! Learn the basics of no-dig growing.',
    gridRows: 6,
    gridCols: 6,
    levelRequired: 0,
    harvestsRequired: 0,
    unlockMessage: 'Welcome to your first growing space!',
    unlocksFeatures: ['compost_heap', 'log_pile', 'bug_hotel', 'wildflower_meadow'],
    realWorldNote: 'Even a small raised bed or a few pots on a balcony can produce food. The key is to start small, learn from the soil, and grow your confidence alongside your plants.',
  },
  {
    id: 2,
    name: 'Allotment',
    description: 'Your growing space has doubled! Room for proper no-dig beds with paths between them — just like a real market garden layout.',
    gridRows: 8,
    gridCols: 8,
    levelRequired: 2,
    harvestsRequired: 10,
    unlockMessage: 'Your garden is expanding! More beds, more growing, more food!',
    unlocksFeatures: ['pond', 'bird_box'],
    realWorldNote: 'An allotment is typically 250 square metres (about 10 perches). Many market gardeners started on an allotment, learning what grows well locally before scaling up. Charles Dowding began with just a few beds!',
  },
  {
    id: 3,
    name: 'Market Garden',
    description: 'A proper market garden takes shape! Neat rows of no-dig beds flanked by compost bays, with a polytunnel for year-round growing.',
    gridRows: 10,
    gridCols: 10,
    levelRequired: 3,
    harvestsRequired: 30,
    unlockMessage: 'You now have a market garden! Time to add a polytunnel and wildlife habitat area.',
    unlocksFeatures: ['polytunnel', 'compost_loo'],
    realWorldNote: 'A quarter-acre market garden with 30 no-dig beds can produce over 1 tonne of vegetables per year. Adding a polytunnel extends the season so you can grow salads even in January!',
  },
  {
    id: 4,
    name: 'Community Farm',
    description: 'Your market garden now feeds the community! A field kitchen turns harvests into meals, and a wash & pack station sends veg boxes to local families.',
    gridRows: 12,
    gridCols: 10,
    levelRequired: 4,
    harvestsRequired: 60,
    unlockMessage: 'Your farm now serves the community! Build a field kitchen and wash & pack station.',
    unlocksFeatures: ['food_forest', 'field_kitchen', 'wash_pack_station'],
    realWorldNote: 'Many successful community farms in the UK run veg box schemes feeding 50-100 families from just half an acre. The field kitchen and pack station are where the magic happens — turning raw harvests into food people can eat and share.',
  },
  {
    id: 5,
    name: '1-Acre Regenerative Farm',
    description: 'The dream realised! A full 1-acre farm with food forest, wildflower meadows, ponds, a cob roundhouse for community gatherings, and enough food to feed a village.',
    gridRows: 14,
    gridCols: 12,
    levelRequired: 5,
    harvestsRequired: 100,
    unlockMessage: 'You have built a thriving 1-acre regenerative farm! The land feeds both nature and community.',
    unlocksFeatures: ['cob_roundhouse'],
    realWorldNote: 'A 1-acre regenerative farm can produce enough food for 100+ people while increasing biodiversity, storing carbon in the soil, and building community. This is the future of food — local, ecological, and run by people who learned to grow as children. You are that person!',
  },
];

export function getStageForLevel(level: number, totalHarvests: number): GardenStage {
  let current = gardenStages[0];
  for (const stage of gardenStages) {
    if (level >= stage.levelRequired && totalHarvests >= stage.harvestsRequired) {
      current = stage;
    } else {
      break;
    }
  }
  return current;
}

export function getNextStage(currentStageId: number): GardenStage | null {
  const idx = gardenStages.findIndex(s => s.id === currentStageId);
  if (idx < 0 || idx >= gardenStages.length - 1) return null;
  return gardenStages[idx + 1];
}

export function getAvailableFeatures(stageId: number): string[] {
  const features: string[] = [];
  for (const stage of gardenStages) {
    if (stage.id <= stageId) {
      features.push(...stage.unlocksFeatures);
    }
  }
  return features;
}
