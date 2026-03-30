const STORAGE_KEY = 'wildgrow_save';

interface SaveData {
  playerName: string;
  difficulty: string;
  xp: number;
  seeds: number;
  water: number;
  compost: number;
  harvestPoints: number;
  totalHarvests: number;
  totalPlanted: number;
  totalWatered: number;
  grid: unknown[][];
  gridRows: number;
  gridCols: number;
  questProgress: unknown[];
  completedQuestIds: string[];
  gameStarted: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function saveState(state: any): void {
  if (typeof window === 'undefined') return;
  try {
    const data: SaveData = {
      playerName: state.playerName as string,
      difficulty: state.difficulty as string,
      xp: state.xp as number,
      seeds: state.seeds as number,
      water: state.water as number,
      compost: state.compost as number,
      harvestPoints: state.harvestPoints as number,
      totalHarvests: state.totalHarvests as number,
      totalPlanted: state.totalPlanted as number,
      totalWatered: state.totalWatered as number,
      grid: state.grid as unknown[][],
      gridRows: state.gridRows as number,
      gridCols: state.gridCols as number,
      questProgress: state.questProgress as unknown[],
      completedQuestIds: state.completedQuestIds as string[],
      gameStarted: state.gameStarted as boolean,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function loadState(): Partial<SaveData> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
