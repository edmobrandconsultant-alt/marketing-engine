import { create } from 'zustand';
import type { Season } from '@/data/plants';
import { plantMap } from '@/data/plants';
import type { BiodiversityType } from '@/data/biodiversity-features';
import { biodiversityMap } from '@/data/biodiversity-features';
import { getCurrentSeason } from '@/game/seasons';
import { getLevelForXP, getXPToNextLevel } from '@/game/progression';
import { loadState, saveState } from '@/lib/storage';
import type { SoilHealth } from '@/game/soil-health';
import { getDefaultSoilHealth, degradeSoilAfterHarvest, improveSoilWithCompost, improveSoilWithMulch } from '@/game/soil-health';
import type { ActiveWeather } from '@/game/weather';

export interface PlotCell {
  plantId: string | null;
  featureId: BiodiversityType | null;
  plantedAt: number | null;
  wateredAt: number | null;
  growthStage: number;
  isNoDigBed: boolean;
  mulched: boolean;
  soilHealth: SoilHealth;
  plantHistory: string[];     // last 3 plant IDs grown here (for crop rotation)
  frostDamaged: boolean;
}

export type DifficultyMode = 'seedling' | 'explorer';

export interface QuestProgress {
  questId: string;
  taskProgress: Record<string, number>;
  completed: boolean;
}

export interface GameState {
  // Player
  playerName: string;
  difficulty: DifficultyMode;
  xp: number;
  seeds: number;
  water: number;
  compost: number;
  harvestPoints: number;
  totalHarvests: number;
  totalPlanted: number;
  totalWatered: number;

  // Garden
  grid: PlotCell[][];
  gridRows: number;
  gridCols: number;

  // Quests
  questProgress: QuestProgress[];
  completedQuestIds: string[];

  // Season & Weather
  currentSeason: Season;
  activeWeather: ActiveWeather | null;

  // UI state
  gameStarted: boolean;
  selectedTool: 'plant' | 'water' | 'harvest' | 'mulch' | 'compost' | 'build' | 'info';
  selectedPlantId: string | null;
  selectedFeatureId: BiodiversityType | null;

  // Computed helpers
  getLevel: () => ReturnType<typeof getLevelForXP>;
  getLevelProgress: () => ReturnType<typeof getXPToNextLevel>;

  // Actions
  startGame: (name: string, difficulty: DifficultyMode) => void;
  setTool: (tool: GameState['selectedTool']) => void;
  selectPlant: (plantId: string | null) => void;
  selectFeature: (featureId: BiodiversityType | null) => void;
  plantSeed: (row: number, col: number) => void;
  waterPlant: (row: number, col: number) => void;
  harvestPlant: (row: number, col: number) => void;
  applyMulch: (row: number, col: number) => void;
  applyCompost: (row: number, col: number) => void;
  buildFeature: (row: number, col: number) => void;
  updateGrowth: (row: number, col: number, newStage: number) => void;
  addXP: (amount: number) => void;
  addResources: (seeds: number, compost: number) => void;
  completeQuest: (questId: string) => void;
  updateQuestProgress: (questId: string, taskId: string, amount: number) => void;
  setWeather: (weather: ActiveWeather | null) => void;
  applyFrostDamage: (row: number, col: number) => void;
  resetGame: () => void;
}

function createEmptyGrid(rows: number, cols: number): PlotCell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      plantId: null,
      featureId: null,
      plantedAt: null,
      wateredAt: null,
      growthStage: 0,
      isNoDigBed: true,
      mulched: false,
      soilHealth: getDefaultSoilHealth(true, false),
      plantHistory: [],
      frostDamaged: false,
    }))
  );
}

const INITIAL_ROWS = 6;
const INITIAL_COLS = 6;

const initialState = {
  playerName: '',
  difficulty: 'seedling' as DifficultyMode,
  xp: 0,
  seeds: 20,
  water: 30,
  compost: 10,
  harvestPoints: 0,
  totalHarvests: 0,
  totalPlanted: 0,
  totalWatered: 0,
  grid: createEmptyGrid(INITIAL_ROWS, INITIAL_COLS),
  gridRows: INITIAL_ROWS,
  gridCols: INITIAL_COLS,
  questProgress: [],
  completedQuestIds: [],
  currentSeason: getCurrentSeason(),
  activeWeather: null as ActiveWeather | null,
  gameStarted: false,
  selectedTool: 'plant' as const,
  selectedPlantId: null as string | null,
  selectedFeatureId: null as BiodiversityType | null,
};

export const useGameStore = create<GameState>((set, get) => {
  const saved = loadState();
  const base = { ...initialState };
  if (saved) {
    Object.assign(base, {
      playerName: saved.playerName ?? base.playerName,
      difficulty: (saved.difficulty as DifficultyMode) ?? base.difficulty,
      xp: saved.xp ?? base.xp,
      seeds: saved.seeds ?? base.seeds,
      water: saved.water ?? base.water,
      compost: saved.compost ?? base.compost,
      harvestPoints: saved.harvestPoints ?? base.harvestPoints,
      totalHarvests: saved.totalHarvests ?? base.totalHarvests,
      totalPlanted: saved.totalPlanted ?? base.totalPlanted,
      totalWatered: saved.totalWatered ?? base.totalWatered,
      grid: (saved.grid as PlotCell[][]) ?? base.grid,
      gridRows: saved.gridRows ?? base.gridRows,
      gridCols: saved.gridCols ?? base.gridCols,
      completedQuestIds: saved.completedQuestIds ?? base.completedQuestIds,
      gameStarted: saved.gameStarted ?? base.gameStarted,
    });
  }

  return {
    ...base,

    getLevel: () => getLevelForXP(get().xp),
    getLevelProgress: () => getXPToNextLevel(get().xp),

    startGame: (name, difficulty) => {
      set({
        playerName: name,
        difficulty,
        gameStarted: true,
        seeds: 20,
        water: 30,
        compost: 10,
        grid: createEmptyGrid(INITIAL_ROWS, INITIAL_COLS),
      });
      saveState(get());
    },

    setTool: (tool) => set({ selectedTool: tool }),
    selectPlant: (plantId) => set({ selectedPlantId: plantId }),
    selectFeature: (featureId) => set({ selectedFeatureId: featureId }),

    plantSeed: (row, col) => {
      const state = get();
      if (!state.selectedPlantId || state.seeds <= 0) return;

      const cell = state.grid[row]?.[col];
      if (!cell || cell.plantId || cell.featureId) return;

      const newGrid = state.grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col] = {
        ...newGrid[row][col],
        plantId: state.selectedPlantId,
        plantedAt: Date.now(),
        growthStage: 0,
      };

      const newTotalPlanted = state.totalPlanted + 1;
      set({
        grid: newGrid,
        seeds: state.seeds - 1,
        totalPlanted: newTotalPlanted,
      });
      saveState(get());
    },

    waterPlant: (row, col) => {
      const state = get();
      if (state.water <= 0) return;

      const cell = state.grid[row]?.[col];
      if (!cell || !cell.plantId) return;

      const newGrid = state.grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col] = {
        ...newGrid[row][col],
        wateredAt: Date.now(),
      };

      set({
        grid: newGrid,
        water: state.water - 1,
        totalWatered: state.totalWatered + 1,
      });
      saveState(get());
    },

    harvestPlant: (row, col) => {
      const state = get();
      const cell = state.grid[row]?.[col];
      if (!cell || !cell.plantId || cell.growthStage < 3) return;

      const plant = plantMap.get(cell.plantId);
      const yield_ = plant?.harvestYield ?? 10;

      const newGrid = state.grid.map(r => r.map(c => ({ ...c })));
      const oldCell = newGrid[row][col];
      const newHistory = [...oldCell.plantHistory, cell.plantId!].slice(-3);
      newGrid[row][col] = {
        ...oldCell,
        plantId: null,
        plantedAt: null,
        wateredAt: null,
        growthStage: 0,
        frostDamaged: false,
        soilHealth: degradeSoilAfterHarvest(oldCell.soilHealth),
        plantHistory: newHistory,
      };

      set({
        grid: newGrid,
        harvestPoints: state.harvestPoints + yield_,
        xp: state.xp + Math.ceil(yield_ / 2),
        seeds: state.seeds + Math.ceil(yield_ / 3),
        totalHarvests: state.totalHarvests + 1,
      });
      saveState(get());
    },

    applyMulch: (row, col) => {
      const state = get();
      if (state.compost < 2) return;

      const cell = state.grid[row]?.[col];
      if (!cell || cell.mulched || cell.featureId) return;

      const newGrid = state.grid.map(r => r.map(c => ({ ...c })));
      const oldCell = newGrid[row][col];
      newGrid[row][col] = {
        ...oldCell,
        mulched: true,
        isNoDigBed: true,
        soilHealth: improveSoilWithMulch(oldCell.soilHealth),
      };

      set({ grid: newGrid, compost: state.compost - 2 });
      saveState(get());
    },

    applyCompost: (row, col) => {
      const state = get();
      if (state.compost < 3) return;

      const cell = state.grid[row]?.[col];
      if (!cell || cell.featureId) return;

      const newGrid = state.grid.map(r => r.map(c => ({ ...c })));
      const oldCell = newGrid[row][col];
      newGrid[row][col] = {
        ...oldCell,
        soilHealth: improveSoilWithCompost(oldCell.soilHealth),
      };

      set({ grid: newGrid, compost: state.compost - 3 });
      saveState(get());
    },

    buildFeature: (row, col) => {
      const state = get();
      if (!state.selectedFeatureId) return;

      const cell = state.grid[row]?.[col];
      if (!cell || cell.plantId || cell.featureId) return;

      const feature = biodiversityMap.get(state.selectedFeatureId);
      if (!feature) return;
      if (state.seeds < feature.cost.seeds || state.compost < feature.cost.compost) return;

      const newGrid = state.grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col] = { ...newGrid[row][col], featureId: state.selectedFeatureId };

      set({
        grid: newGrid,
        seeds: state.seeds - feature.cost.seeds,
        compost: state.compost - feature.cost.compost,
        xp: state.xp + 15,
      });
      saveState(get());
    },

    updateGrowth: (row, col, newStage) => {
      const state = get();
      const newGrid = state.grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col] = { ...newGrid[row][col], growthStage: newStage };
      set({ grid: newGrid });
      // Don't save on every tick to reduce writes
    },

    addXP: (amount) => {
      set(s => ({ xp: s.xp + amount }));
      saveState(get());
    },

    addResources: (seeds, compost) => {
      set(s => ({ seeds: s.seeds + seeds, compost: s.compost + compost }));
      saveState(get());
    },

    completeQuest: (questId) => {
      set(s => ({
        completedQuestIds: [...s.completedQuestIds, questId],
      }));
      saveState(get());
    },

    updateQuestProgress: (questId, taskId, amount) => {
      set(s => {
        const existing = s.questProgress.find(q => q.questId === questId);
        if (existing) {
          return {
            questProgress: s.questProgress.map(q =>
              q.questId === questId
                ? { ...q, taskProgress: { ...q.taskProgress, [taskId]: (q.taskProgress[taskId] || 0) + amount } }
                : q
            ),
          };
        }
        return {
          questProgress: [...s.questProgress, { questId, taskProgress: { [taskId]: amount }, completed: false }],
        };
      });
      saveState(get());
    },

    setWeather: (weather) => {
      set({ activeWeather: weather });
      saveState(get());
    },

    applyFrostDamage: (row, col) => {
      const state = get();
      const cell = state.grid[row]?.[col];
      if (!cell || !cell.plantId) return;

      const newGrid = state.grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col] = {
        ...newGrid[row][col],
        frostDamaged: true,
        growthStage: Math.max(0, cell.growthStage - 1),
      };
      set({ grid: newGrid });
      saveState(get());
    },

    resetGame: () => {
      set(initialState);
      saveState(get());
    },
  };
});
