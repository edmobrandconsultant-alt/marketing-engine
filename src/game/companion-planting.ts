import { plantMap } from '@/data/plants';
import type { PlotCell } from '@/store/game-store';

interface CompanionResult {
  bonus: number;       // multiplier (1.0 = no effect, 1.25 = 25% faster)
  companions: string[];
  antagonists: string[];
}

function getAdjacentCells(grid: PlotCell[][], row: number, col: number): PlotCell[] {
  const adjacent: PlotCell[] = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
      adjacent.push(grid[r][c]);
    }
  }
  return adjacent;
}

export function calculateCompanionBonus(
  grid: PlotCell[][],
  row: number,
  col: number,
): CompanionResult {
  const cell = grid[row][col];
  if (!cell.plantId) return { bonus: 1.0, companions: [], antagonists: [] };

  const plant = plantMap.get(cell.plantId);
  if (!plant) return { bonus: 1.0, companions: [], antagonists: [] };

  const adjacent = getAdjacentCells(grid, row, col);
  const companions: string[] = [];
  const antagonists: string[] = [];
  let bonus = 1.0;

  for (const neighbor of adjacent) {
    if (!neighbor.plantId || neighbor.plantId === cell.plantId) continue;

    if (plant.companionIds.includes(neighbor.plantId)) {
      companions.push(neighbor.plantId);
      bonus += 0.1; // +10% per companion neighbor
    }

    if (plant.antagonistIds.includes(neighbor.plantId)) {
      antagonists.push(neighbor.plantId);
      bonus -= 0.15; // -15% per antagonist neighbor
    }
  }

  // Cap bonuses
  bonus = Math.max(0.5, Math.min(bonus, 2.0));

  return { bonus, companions, antagonists };
}

export function hasCompanionPair(grid: PlotCell[][]): boolean {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const result = calculateCompanionBonus(grid, r, c);
      if (result.companions.length > 0) return true;
    }
  }
  return false;
}
