/**
 * Crop Rotation - Based on Charles Dowding's No-Dig Approach
 *
 * Dowding teaches that in healthy no-dig soil, strict rotation is less critical
 * because the undisturbed soil biology (fungi, bacteria, worms) naturally
 * suppresses disease and maintains fertility. However, some rotation is still
 * beneficial — particularly avoiding brassicas and potatoes in the same spot,
 * and following hungry feeders with legumes.
 *
 * Key Dowding principles:
 * 1. No-dig beds reduce disease pressure, so rotation is a guideline, not a rule
 * 2. Compost is the foundation — regular surface-applied compost feeds soil life
 * 3. Successive/inter-sowing: fill gaps immediately rather than leaving soil bare
 * 4. Follow heavy feeders (brassicas, potatoes) with lighter feeders or legumes
 * 5. Potatoes and brassicas benefit most from rotation (clubroot, blight)
 * 6. Lettuce, beans, and most salads can repeat without issue in no-dig beds
 */

export type PlantFamily = 'solanaceae' | 'legume' | 'brassica' | 'allium' | 'umbelliferae' | 'other';

// How much a family depletes soil (Dowding's "hungry feeder" concept)
export type FeedingLevel = 'heavy' | 'moderate' | 'light' | 'giver';

// Map plant IDs to their botanical families
const plantFamilies: Record<string, PlantFamily> = {
  tomato: 'solanaceae',
  potato: 'solanaceae',
  carrot: 'umbelliferae',
  parsley: 'umbelliferae',
  fennel: 'umbelliferae',
  cabbage: 'brassica',
  radish: 'brassica',
  nasturtium: 'brassica',
  onion: 'allium',
  pea: 'legume',
  bean: 'legume',
  lettuce: 'other',
  sweetcorn: 'other',
  basil: 'other',
  rosemary: 'other',
  marigold: 'other',
  sunflower: 'other',
  lavender: 'other',
  strawberry: 'other',
  apple_tree: 'other',
};

// Dowding categorises plants by how much they take from the soil
const feedingLevels: Record<string, FeedingLevel> = {
  potato: 'heavy',
  cabbage: 'heavy',
  tomato: 'heavy',
  sweetcorn: 'heavy',
  bean: 'giver',        // nitrogen fixer
  pea: 'giver',         // nitrogen fixer
  onion: 'moderate',
  carrot: 'moderate',
  lettuce: 'light',
  radish: 'light',
  basil: 'light',
  parsley: 'light',
  rosemary: 'light',
  marigold: 'light',
  sunflower: 'moderate',
  nasturtium: 'light',
  lavender: 'light',
  fennel: 'moderate',
  strawberry: 'moderate',
  apple_tree: 'moderate',
};

// Families where rotation matters most (disease-prone in conventional growing)
const ROTATION_SENSITIVE_FAMILIES: PlantFamily[] = ['brassica', 'solanaceae'];

const familyNames: Record<PlantFamily, string> = {
  solanaceae: 'Nightshade',
  legume: 'Legume',
  brassica: 'Brassica',
  allium: 'Allium',
  umbelliferae: 'Carrot family',
  other: 'Other',
};

const familyEmojis: Record<PlantFamily, string> = {
  solanaceae: '🍅',
  legume: '🫘',
  brassica: '🥬',
  allium: '🧅',
  umbelliferae: '🥕',
  other: '🌿',
};

export function getPlantFamily(plantId: string): PlantFamily {
  return plantFamilies[plantId] || 'other';
}

export function getFeedingLevel(plantId: string): FeedingLevel {
  return feedingLevels[plantId] || 'light';
}

export function getFamilyName(family: PlantFamily): string {
  return familyNames[family];
}

export function getFamilyEmoji(family: PlantFamily): string {
  return familyEmojis[family];
}

export interface RotationResult {
  penalty: number;       // growth speed penalty (0 = none, 0.3 = 30% slower)
  warning: string | null;
  tip: string | null;
  dowdingNote: string | null;
}

export function checkCropRotation(
  plantId: string,
  plotHistory: string[],
  isNoDigBed: boolean = false,
): RotationResult {
  if (plotHistory.length === 0) {
    return { penalty: 0, warning: null, tip: null, dowdingNote: null };
  }

  const newFamily = getPlantFamily(plantId);
  const newFeeding = getFeedingLevel(plantId);
  const lastPlantId = plotHistory[plotHistory.length - 1];
  const lastFamily = getPlantFamily(lastPlantId);
  const lastFeeding = getFeedingLevel(lastPlantId);

  // 'other' and 'light' feeders can repeat freely — Dowding shows lettuce,
  // salads, and herbs thrive when replanted in no-dig beds
  if (newFamily === 'other' || (newFeeding === 'light' && newFamily !== 'brassica')) {
    if (newFamily === lastFamily && newFamily !== 'other') {
      return {
        penalty: 0,
        warning: null,
        tip: null,
        dowdingNote: 'Charles Dowding shows that light feeders repeat well in no-dig beds — the healthy soil biology prevents problems.',
      };
    }
    return { penalty: 0, warning: null, tip: null, dowdingNote: null };
  }

  // LEGUMES after anything = great (nitrogen fixers)
  if (newFamily === 'legume') {
    return {
      penalty: -0.1, // bonus
      warning: null,
      tip: 'Great choice! Peas and beans fix nitrogen from the air into the soil through bacteria on their roots. The next crop planted here will benefit.',
      dowdingNote: 'Dowding recommends following heavy feeders like brassicas with legumes. After harvesting, leave the roots in the ground — they contain nitrogen nodules that feed the next crop.',
    };
  }

  // Following legumes = nitrogen bonus (Dowding's key principle)
  if (lastFeeding === 'giver') {
    return {
      penalty: -0.15, // bonus
      warning: null,
      tip: `Nitrogen bonus! ${lastPlantId === 'pea' ? 'Peas' : 'Beans'} enriched this soil. Your ${plantId} will grow stronger here.`,
      dowdingNote: 'Dowding always follows legumes with hungry feeders like brassicas or potatoes. The nitrogen left by the legume roots gives the next crop a real boost — no artificial fertiliser needed!',
    };
  }

  // Same SENSITIVE family consecutively (brassicas and solanaceae)
  if (newFamily === lastFamily && ROTATION_SENSITIVE_FAMILIES.includes(newFamily)) {
    const familyName = getFamilyName(newFamily);

    // No-dig beds reduce the penalty — Dowding's key insight
    const basePenalty = isNoDigBed ? 0.10 : 0.25;
    const noDigNote = isNoDigBed
      ? `In your no-dig bed, the healthy soil fungi network helps suppress ${newFamily === 'brassica' ? 'clubroot' : 'blight'}. Penalty reduced!`
      : `In a no-dig bed, this penalty would be smaller. Healthy soil biology suppresses disease — try adding compost and mulch!`;

    return {
      penalty: basePenalty,
      warning: `${familyName} family was here last. ${isNoDigBed ? 'Small' : 'Significant'} growth penalty.`,
      tip: newFamily === 'brassica'
        ? 'Brassicas (cabbage, radish) are prone to clubroot disease that builds up in soil. Even Dowding recommends some rotation for brassicas.'
        : 'Potatoes and tomatoes share blight risk. Dowding grows tomatoes in the same polytunnel spots but rotates outdoor potatoes.',
      dowdingNote: noDigNote,
    };
  }

  // Heavy feeder after heavy feeder (not same family, but still depleting)
  if (newFeeding === 'heavy' && lastFeeding === 'heavy') {
    const basePenalty = isNoDigBed ? 0.05 : 0.15;
    return {
      penalty: basePenalty,
      warning: isNoDigBed ? null : 'Two hungry crops in a row — soil may be depleted.',
      tip: 'Dowding says: apply compost between heavy-feeding crops. A 5cm layer of compost restores what the previous crop took.',
      dowdingNote: isNoDigBed
        ? 'Your no-dig bed\'s compost layer is feeding the soil life, which feeds your plants. Keep topping up compost between crops!'
        : 'In conventional beds, two heavy feeders exhaust the soil. No-dig avoids this because each crop gets a fresh compost mulch on top.',
    };
  }

  // Check two-back for sensitive families
  if (plotHistory.length >= 2 && ROTATION_SENSITIVE_FAMILIES.includes(newFamily)) {
    const twoBackFamily = getPlantFamily(plotHistory[plotHistory.length - 2]);
    if (newFamily === twoBackFamily) {
      return {
        penalty: isNoDigBed ? 0.03 : 0.10,
        warning: isNoDigBed ? null : 'This family was here recently.',
        tip: null,
        dowdingNote: 'Dowding\'s simple rotation: alternate between plant families when you can, but don\'t stress about it. Healthy soil from regular compost is more important than perfect rotation.',
      };
    }
  }

  // Dowding's successive sowing encouragement
  return {
    penalty: 0,
    warning: null,
    tip: null,
    dowdingNote: plotHistory.length > 0
      ? 'Good rotation! Dowding says the most important thing is to never leave soil bare. As soon as one crop finishes, plant the next or add compost.'
      : null,
  };
}

// Dowding's feeding sequence recommendation
export function getDowndingSequence(lastPlantId: string): string {
  const feeding = getFeedingLevel(lastPlantId);
  const family = getPlantFamily(lastPlantId);

  switch (feeding) {
    case 'heavy':
      return 'After a hungry feeder, Dowding recommends legumes (peas, beans) to restore nitrogen, or light feeders like lettuce and salads.';
    case 'giver':
      return 'After legumes, plant your hungriest crops here — brassicas, potatoes, or sweetcorn will thrive on the nitrogen left behind.';
    case 'moderate':
      return 'Follow with a different family. Light feeders or legumes work well here.';
    case 'light':
      return 'Light feeders leave soil in good shape. You can follow with almost anything — add a compost top-up for hungry feeders.';
    default:
      return 'Add compost and plant your next crop!';
  }
}

export const ROTATION_EDUCATIONAL = `Charles Dowding has gardened the same no-dig beds for over 40 years. His key discovery: when you stop digging and keep adding compost on top, the soil biology — billions of fungi, bacteria, and worms — stays intact and naturally suppresses disease.

This means strict crop rotation becomes less important in no-dig beds. The undisturbed fungal networks (mycorrhizae) help plants resist disease that would build up in disturbed, dug soil.

Dowding's simple approach:
• Add 3-5cm of compost on top each year — never dig it in
• Follow hungry feeders (brassicas, potatoes) with nitrogen-fixers (peas, beans)
• Never leave soil bare — sow the next crop as soon as one finishes
• Brassicas and potatoes still benefit from some rotation, even in no-dig
• Most other crops can repeat happily in healthy no-dig soil

The result? Dowding consistently out-yields neighbouring dug plots, with less disease, fewer pests, and no artificial fertiliser.`;
