export interface SoilHealth {
  fertility: number;    // 0-100, affects growth speed
  moisture: number;     // 0-100, affects water retention
  biology: number;      // 0-100, beneficial soil life (worms, fungi, microbes)
}

export function getDefaultSoilHealth(isNoDigBed: boolean, mulched: boolean): SoilHealth {
  let fertility = 50;
  let moisture = 40;
  let biology = 30;

  if (isNoDigBed) {
    fertility += 20;
    biology += 25;
  }
  if (mulched) {
    moisture += 20;
    biology += 10;
  }

  return {
    fertility: Math.min(100, fertility),
    moisture: Math.min(100, moisture),
    biology: Math.min(100, biology),
  };
}

export function getSoilGrowthMultiplier(soil: SoilHealth): number {
  // Average of all three scores, normalized to a multiplier
  const avg = (soil.fertility + soil.moisture + soil.biology) / 3;
  // 50 = 1.0x, 100 = 1.3x, 0 = 0.7x
  return 0.7 + (avg / 100) * 0.6;
}

export function degradeSoilAfterHarvest(soil: SoilHealth): SoilHealth {
  return {
    fertility: Math.max(0, soil.fertility - 15),
    moisture: Math.max(0, soil.moisture - 5),
    biology: Math.max(0, soil.biology - 5),
  };
}

export function improveSoilWithCompost(soil: SoilHealth): SoilHealth {
  return {
    fertility: Math.min(100, soil.fertility + 25),
    moisture: Math.min(100, soil.moisture + 10),
    biology: Math.min(100, soil.biology + 15),
  };
}

export function improveSoilWithMulch(soil: SoilHealth): SoilHealth {
  return {
    fertility: Math.min(100, soil.fertility + 5),
    moisture: Math.min(100, soil.moisture + 25),
    biology: Math.min(100, soil.biology + 10),
  };
}

export function improveSoilOverTime(soil: SoilHealth, isNoDigBed: boolean): SoilHealth {
  // No-dig beds improve biology over time as soil life establishes
  const biologyGain = isNoDigBed ? 2 : 0.5;
  return {
    fertility: Math.min(100, soil.fertility + 0.5),
    moisture: soil.moisture, // stays the same without intervention
    biology: Math.min(100, soil.biology + biologyGain),
  };
}

export function getSoilRating(soil: SoilHealth): { label: string; emoji: string; color: string } {
  const avg = (soil.fertility + soil.moisture + soil.biology) / 3;
  if (avg >= 80) return { label: 'Excellent', emoji: '🌟', color: 'text-green-600' };
  if (avg >= 60) return { label: 'Good', emoji: '👍', color: 'text-emerald-600' };
  if (avg >= 40) return { label: 'Fair', emoji: '😐', color: 'text-amber-600' };
  if (avg >= 20) return { label: 'Poor', emoji: '😟', color: 'text-orange-600' };
  return { label: 'Depleted', emoji: '💀', color: 'text-red-600' };
}

export const SOIL_EDUCATIONAL = `Healthy soil is alive! A single teaspoon of good garden soil contains more microorganisms than there are people on Earth. These tiny creatures break down organic matter into nutrients that plants can absorb. No-dig gardening protects this underground ecosystem by never disturbing it with a spade.`;
