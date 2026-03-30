import type { PlotCell } from '@/store/game-store';
import { plantMap } from '@/data/plants';
import { calculateCompanionBonus } from './companion-planting';
import { getBiodiversityBonusForCell } from './biodiversity';
import { getSoilGrowthMultiplier } from './soil-health';
import { checkCropRotation } from './crop-rotation';
import type { ActiveWeather } from './weather';
import { getWeatherGrowthMultiplier } from './weather';

export interface GrowthUpdate {
  row: number;
  col: number;
  newStage: number;
  readyToHarvest: boolean;
}

export function processGrowth(
  grid: PlotCell[][],
  activeWeather?: ActiveWeather | null,
): GrowthUpdate[] {
  const now = Date.now();
  const updates: GrowthUpdate[] = [];

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const cell = grid[r][c];
      if (!cell.plantId || !cell.plantedAt || cell.growthStage >= 3) continue;
      if (cell.frostDamaged) continue; // frozen plants don't grow

      const plant = plantMap.get(cell.plantId);
      if (!plant) continue;

      // Calculate growth speed modifiers
      let speedMultiplier = 1.0;

      // Companion bonus
      const companionResult = calculateCompanionBonus(grid, r, c);
      speedMultiplier *= companionResult.bonus;

      // Biodiversity bonus
      speedMultiplier *= getBiodiversityBonusForCell(grid, r, c);

      // No-dig bonus
      if (cell.isNoDigBed) speedMultiplier *= 1.2;
      if (cell.mulched) speedMultiplier *= 1.1;

      // Watering bonus (recently watered = faster)
      if (cell.wateredAt && now - cell.wateredAt < 3 * 60 * 1000) {
        speedMultiplier *= 1.15;
      }

      // Soil health bonus
      speedMultiplier *= getSoilGrowthMultiplier(cell.soilHealth);

      // Crop rotation penalty/bonus
      const rotation = checkCropRotation(cell.plantId, cell.plantHistory);
      speedMultiplier *= (1 - rotation.penalty);

      // Weather effects
      speedMultiplier *= getWeatherGrowthMultiplier(activeWeather ?? null);

      // Calculate growth stage
      const baseGrowthTime = plant.growthTimeMinutes * 60 * 1000; // ms
      const adjustedGrowthTime = baseGrowthTime / speedMultiplier;
      const stageTime = adjustedGrowthTime / 3; // 3 growth transitions (0->1, 1->2, 2->3)

      const elapsed = now - cell.plantedAt;
      const newStage = Math.min(3, Math.floor(elapsed / stageTime));

      if (newStage > cell.growthStage) {
        updates.push({
          row: r,
          col: c,
          newStage,
          readyToHarvest: newStage >= 3,
        });
      }
    }
  }

  return updates;
}
