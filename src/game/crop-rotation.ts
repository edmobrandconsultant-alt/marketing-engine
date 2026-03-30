import type { PlantType } from '@/data/plants';

// Plant families for crop rotation
export type PlantFamily = 'solanaceae' | 'legume' | 'brassica' | 'allium' | 'umbelliferae' | 'other';

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
}

export function checkCropRotation(
  plantId: string,
  plotHistory: string[],
): RotationResult {
  if (plotHistory.length === 0) {
    return { penalty: 0, warning: null, tip: null };
  }

  const newFamily = getPlantFamily(plantId);

  // 'other' family doesn't trigger rotation penalties
  if (newFamily === 'other') {
    return { penalty: 0, warning: null, tip: null };
  }

  const lastPlantId = plotHistory[plotHistory.length - 1];
  const lastFamily = getPlantFamily(lastPlantId);

  // Same family planted consecutively
  if (newFamily === lastFamily) {
    const familyName = getFamilyName(newFamily);
    return {
      penalty: 0.25,
      warning: `Same family! ${familyName} plants were here last. Growth -25%.`,
      tip: `Crop rotation tip: Don't plant ${familyName} family in the same spot twice. Rotate with a different family to keep soil healthy!`,
    };
  }

  // Bonus for following legumes (nitrogen fixers)
  if (lastFamily === 'legume') {
    return {
      penalty: -0.15, // negative penalty = bonus
      warning: null,
      tip: 'Bonus! Legumes left nitrogen in the soil. Your plants will grow faster here!',
    };
  }

  // Check two-back (the plant before last)
  if (plotHistory.length >= 2) {
    const twoBackFamily = getPlantFamily(plotHistory[plotHistory.length - 2]);
    if (newFamily === twoBackFamily) {
      return {
        penalty: 0.1,
        warning: `This family was here recently. Small growth penalty.`,
        tip: 'Try a 3-year rotation: Legumes → Brassicas → Root veg → repeat!',
      };
    }
  }

  return { penalty: 0, warning: null, tip: null };
}

export const ROTATION_EDUCATIONAL = `Crop rotation means not growing the same plant family in the same spot year after year. Different plants take different nutrients from the soil and attract different pests. By rotating, the soil stays healthy and pests can't build up! A classic 4-year rotation is: Year 1: Legumes (peas, beans) → Year 2: Brassicas (cabbage, radish) → Year 3: Root veg (carrots, onions) → Year 4: Nightshades (tomatoes, potatoes).`;
