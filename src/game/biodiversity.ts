import type { PlotCell } from '@/store/game-store';
import { biodiversityMap } from '@/data/biodiversity-features';

export interface BiodiversityScore {
  total: number;
  plantDiversity: number;
  featureBonus: number;
  monoculturePenalty: number;
  breakdown: string[];
}

export function calculateBiodiversity(grid: PlotCell[][]): BiodiversityScore {
  const plantCounts = new Map<string, number>();
  let totalPlants = 0;
  const features: string[] = [];
  const breakdown: string[] = [];

  for (const row of grid) {
    for (const cell of row) {
      if (cell.plantId) {
        plantCounts.set(cell.plantId, (plantCounts.get(cell.plantId) || 0) + 1);
        totalPlants++;
      }
      if (cell.featureId) {
        features.push(cell.featureId);
      }
    }
  }

  // Plant diversity: 10 points per unique species
  const uniquePlants = plantCounts.size;
  const plantDiversity = uniquePlants * 10;
  if (uniquePlants > 0) {
    breakdown.push(`${uniquePlants} plant species (+${plantDiversity})`);
  }

  // Feature bonus: points per biodiversity feature
  let featureBonus = 0;
  for (const fId of features) {
    const feature = biodiversityMap.get(fId as 'pond');
    if (feature) {
      featureBonus += 15;
      breakdown.push(`${feature.name} (+15)`);
    }
  }

  // Monoculture penalty: if any single plant is >50% of total
  let monoculturePenalty = 0;
  if (totalPlants >= 4) {
    for (const [plantId, count] of plantCounts) {
      if (count / totalPlants > 0.5) {
        monoculturePenalty = -20;
        breakdown.push(`Too much ${plantId}! Monoculture penalty (-20)`);
      }
    }
  }

  const total = Math.max(0, plantDiversity + featureBonus + monoculturePenalty);

  return { total, plantDiversity, featureBonus, monoculturePenalty, breakdown };
}

export function getBiodiversityBonusForCell(
  grid: PlotCell[][],
  row: number,
  col: number,
): number {
  let bonus = 1.0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const cell = grid[r][c];
      if (!cell.featureId) continue;

      const feature = biodiversityMap.get(cell.featureId);
      if (!feature) continue;

      const distance = Math.max(Math.abs(r - row), Math.abs(c - col));
      if (distance <= feature.bonus.radius && distance > 0) {
        bonus *= feature.bonus.multiplier;
      }
    }
  }

  return bonus;
}

/** Count how many compost loos are in the garden — each generates bonus compost */
export function countCompostLoos(grid: PlotCell[][]): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.featureId === 'compost_loo') count++;
    }
  }
  return count;
}
