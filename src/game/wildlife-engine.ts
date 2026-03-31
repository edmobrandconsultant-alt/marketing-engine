import type { Season } from '@/data/plants';
import type { WildlifeVisitor } from '@/data/wildlife';
import { getAttractedVisitors } from '@/data/wildlife';
import type { PlotCell } from '@/store/game-store';

export interface WildlifeVisit {
  id: string;          // unique visit ID
  visitor: WildlifeVisitor;
  position: { row: number; col: number };
  duration: number;    // milliseconds
  startedAt: number;   // timestamp
}

const RARITY_BASE_CHANCE: Record<string, number> = {
  common: 0.6,
  uncommon: 0.3,
  rare: 0.1,
};

const MIN_DURATION = 15_000;  // 15 seconds
const MAX_DURATION = 45_000;  // 45 seconds
const MAX_SIMULTANEOUS = 3;

/**
 * Calculate the probability (0–1) that a given visitor appears,
 * based on rarity, how many of its attracting features exist, and season match.
 */
export function calculateVisitChance(
  visitor: WildlifeVisitor,
  featureIds: string[],
  season: Season,
): number {
  // Not active this season => 0
  if (!visitor.activeSeasons.includes(season)) return 0;

  const matchCount = visitor.attractedBy.filter(f => featureIds.includes(f)).length;
  if (matchCount < visitor.minFeatures) return 0;

  const base = RARITY_BASE_CHANCE[visitor.rarity] ?? 0.1;

  // Bonus for having more features than the minimum
  const extraFeatures = matchCount - visitor.minFeatures;
  const featureBonus = extraFeatures * 0.15;

  return Math.min(1, base + featureBonus);
}

/**
 * Collect unique feature IDs present on the grid.
 */
function getFeatureIds(grid: PlotCell[][]): string[] {
  const ids = new Set<string>();
  for (const row of grid) {
    for (const cell of row) {
      if (cell.featureId) ids.add(cell.featureId);
    }
  }
  return Array.from(ids);
}

/**
 * Find cells adjacent to a given feature on the grid.
 */
function findAdjacentCells(
  grid: PlotCell[][],
  featureId: string,
): { row: number; col: number }[] {
  const results: { row: number; col: number }[] = [];
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].featureId === featureId) {
        // Check all 8 directions + the feature cell itself
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              results.push({ row: nr, col: nc });
            }
          }
        }
      }
    }
  }

  return results;
}

/**
 * Scan the grid for biodiversity features, determine which visitors appear,
 * and return an array of visits. Respects MAX_SIMULTANEOUS.
 */
export function generateVisits(
  grid: PlotCell[][],
  season: Season,
  currentVisitCount: number = 0,
): WildlifeVisit[] {
  const featureIds = getFeatureIds(grid);
  if (featureIds.length === 0) return [];

  const candidates = getAttractedVisitors(featureIds, season);
  if (candidates.length === 0) return [];

  const slotsAvailable = MAX_SIMULTANEOUS - currentVisitCount;
  if (slotsAvailable <= 0) return [];

  const visits: WildlifeVisit[] = [];
  const now = Date.now();

  // Shuffle candidates for variety
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);

  for (const visitor of shuffled) {
    if (visits.length >= slotsAvailable) break;

    const chance = calculateVisitChance(visitor, featureIds, season);
    if (Math.random() > chance) continue;

    // Pick a random position adjacent to one of its attracting features
    const attractingFeatures = visitor.attractedBy.filter(f => featureIds.includes(f));
    const featureToVisit = attractingFeatures[Math.floor(Math.random() * attractingFeatures.length)];
    const adjacentCells = findAdjacentCells(grid, featureToVisit);

    if (adjacentCells.length === 0) continue;

    const position = adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
    const duration = MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION);

    visits.push({
      id: `${visitor.id}-${now}-${Math.random().toString(36).slice(2, 8)}`,
      visitor,
      position,
      duration,
      startedAt: now,
    });
  }

  return visits;
}
