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
import { getStageForLevel } from '@/data/garden-stages';
import { getUnlockedItems, getItemById } from '@/data/character-items';
import { getTraderById } from '@/data/trading';

export interface PlotCell {
  plantId: string | null;
  featureId: BiodiversityType | null;
  plantedAt: number | null;
  wateredAt: number | null;
  growthStage: number;
  isNoDigBed: boolean;
  mulched: boolean;
  composted: boolean;         // has received annual compost dressing this season
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
  gardenStageId: number;        // current garden expansion stage (1-5)

  // Quests
  questProgress: QuestProgress[];
  completedQuestIds: string[];

  // Season & Weather
  currentSeason: Season;
  lastCompostYear: number | null;   // year of last annual compost application
  activeWeather: ActiveWeather | null;

  // Character & Trading
  unlockedItems: string[];
  equippedItems: { hat: string | null; outfit: string | null; tool: string | null; accessory: string | null };
  tradeHistory: { traderId: string; itemGiven: string; itemReceived: string; timestamp: number }[];
  compostApplications: number;

  // Wildlife
  discoveredWildlife: Record<string, number>;

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
  applyAnnualCompost: () => void;
  buildFeature: (row: number, col: number) => void;
  updateGrowth: (row: number, col: number, newStage: number) => void;
  addXP: (amount: number) => void;
  addResources: (seeds: number, compost: number) => void;
  completeQuest: (questId: string) => void;
  updateQuestProgress: (questId: string, taskId: string, amount: number) => void;
  setWeather: (weather: ActiveWeather | null) => void;
  applyFrostDamage: (row: number, col: number) => void;
  checkGardenExpansion: () => string | null;  // returns unlock message if expanded, null otherwise
  discoverWildlife: (wildlifeId: string) => void;
  equipItem: (itemId: string) => void;
  unequipSlot: (slot: 'hat' | 'outfit' | 'tool' | 'accessory') => void;
  executeTrade: (traderId: string, offerId: string) => boolean;
  checkItemUnlocks: () => void;
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
      composted: false,
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
  gardenStageId: 1,
  questProgress: [],
  completedQuestIds: [],
  unlockedItems: [] as string[],
  equippedItems: { hat: null, outfit: null, tool: null, accessory: null } as { hat: string | null; outfit: string | null; tool: string | null; accessory: string | null },
  tradeHistory: [] as { traderId: string; itemGiven: string; itemReceived: string; timestamp: number }[],
  compostApplications: 0,
  discoveredWildlife: {} as Record<string, number>,
  currentSeason: getCurrentSeason(),
  lastCompostYear: null as number | null,
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
      gardenStageId: (saved.gardenStageId as number) ?? base.gardenStageId,
      completedQuestIds: saved.completedQuestIds ?? base.completedQuestIds,
      unlockedItems: (saved as Record<string, unknown>).unlockedItems as string[] ?? base.unlockedItems,
      equippedItems: (saved as Record<string, unknown>).equippedItems as typeof base.equippedItems ?? base.equippedItems,
      tradeHistory: (saved as Record<string, unknown>).tradeHistory as typeof base.tradeHistory ?? base.tradeHistory,
      compostApplications: (saved as Record<string, unknown>).compostApplications as number ?? base.compostApplications,
      discoveredWildlife: (saved as Record<string, unknown>).discoveredWildlife as Record<string, number> ?? base.discoveredWildlife,
      lastCompostYear: (saved.lastCompostYear as number | null) ?? base.lastCompostYear,
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
      get().checkItemUnlocks();
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

    applyAnnualCompost: () => {
      const state = get();
      const currentYear = new Date().getFullYear();

      // Dowding: one inch of compost, once a year, applied in autumn/winter
      if (state.lastCompostYear === currentYear) return; // already applied this year

      // Count plots that need composting (not features)
      const plotCount = state.grid.flat().filter(c => !c.featureId).length;
      const compostNeeded = Math.ceil(plotCount / 4); // 1 compost per 4 plots
      if (state.compost < compostNeeded) return;

      const newGrid = state.grid.map(r => r.map(c => {
        if (c.featureId) return { ...c };
        return {
          ...c,
          composted: true,
          soilHealth: improveSoilWithCompost(c.soilHealth),
        };
      }));

      set({
        grid: newGrid,
        compost: state.compost - compostNeeded,
        lastCompostYear: currentYear,
        compostApplications: state.compostApplications + 1,
      });
      saveState(get());
      get().checkItemUnlocks();
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
      get().checkItemUnlocks();
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

    checkGardenExpansion: () => {
      const state = get();
      const level = getLevelForXP(state.xp);
      const eligibleStage = getStageForLevel(level.level, state.totalHarvests);

      if (eligibleStage.id <= state.gardenStageId) return null;

      // Expand the grid, preserving existing cells
      const newRows = eligibleStage.gridRows;
      const newCols = eligibleStage.gridCols;
      const newGrid: PlotCell[][] = [];

      for (let r = 0; r < newRows; r++) {
        const row: PlotCell[] = [];
        for (let c = 0; c < newCols; c++) {
          if (r < state.grid.length && c < state.grid[0].length) {
            row.push({ ...state.grid[r][c] });
          } else {
            row.push({
              plantId: null,
              featureId: null,
              plantedAt: null,
              wateredAt: null,
              growthStage: 0,
              isNoDigBed: true,
              mulched: false,
              composted: false,
              soilHealth: getDefaultSoilHealth(true, false),
              plantHistory: [],
              frostDamaged: false,
            });
          }
        }
        newGrid.push(row);
      }

      set({
        grid: newGrid,
        gridRows: newRows,
        gridCols: newCols,
        gardenStageId: eligibleStage.id,
      });
      saveState(get());
      return eligibleStage.unlockMessage;
    },

    discoverWildlife: (wildlifeId: string) => {
      set(s => ({
        discoveredWildlife: {
          ...s.discoveredWildlife,
          [wildlifeId]: (s.discoveredWildlife[wildlifeId] ?? 0) + 1,
        },
      }));
      saveState(get());
    },

    equipItem: (itemId: string) => {
      const state = get();
      if (!state.unlockedItems.includes(itemId)) return;
      const item = getItemById(itemId);
      if (!item) return;
      const slot = item.category as string;
      if (!['hat', 'outfit', 'tool', 'accessory'].includes(slot)) return;
      const equipped = { ...state.equippedItems };
      equipped[slot as keyof typeof equipped] = itemId;
      set({ equippedItems: equipped });
      saveState(get());
    },

    unequipSlot: (slot: 'hat' | 'outfit' | 'tool' | 'accessory') => {
      const state = get();
      const equipped = { ...state.equippedItems };
      equipped[slot] = null;
      set({ equippedItems: equipped });
      saveState(get());
    },

    executeTrade: (traderId: string, offerId: string) => {
      const state = get();
      const trader = getTraderById(traderId);
      if (!trader) return false;
      const offer = trader.offers.find(o => o.id === offerId);
      if (!offer || offer.status !== 'open') return false;

      // Check that the player has all the requested items (which they give away)
      for (const reqItem of offer.requestedItems) {
        if (!state.unlockedItems.includes(reqItem)) return false;
      }

      // Remove requested items from player, add offered items
      let newUnlocked = [...state.unlockedItems];
      for (const reqItem of offer.requestedItems) {
        const idx = newUnlocked.indexOf(reqItem);
        if (idx !== -1) newUnlocked.splice(idx, 1);
      }
      newUnlocked = [...newUnlocked, ...offer.offeredItems];

      // Unequip any items that were traded away
      const newEquipped = { ...state.equippedItems };
      for (const slot of ['hat', 'outfit', 'tool', 'accessory'] as const) {
        if (newEquipped[slot] && !newUnlocked.includes(newEquipped[slot]!)) {
          newEquipped[slot] = null;
        }
      }

      const newHistory = [...state.tradeHistory, {
        traderId,
        itemGiven: offer.requestedItems.join(','),
        itemReceived: offer.offeredItems.join(','),
        timestamp: Date.now(),
      }];

      set({
        unlockedItems: newUnlocked,
        equippedItems: newEquipped,
        tradeHistory: newHistory,
      });
      saveState(get());
      return true;
    },

    checkItemUnlocks: () => {
      const state = get();
      const level = getLevelForXP(state.xp);
      const newlyUnlocked = getUnlockedItems({
        level: level.level,
        totalHarvests: state.totalHarvests,
        gardenStageId: state.gardenStageId,
        totalPlanted: state.totalPlanted,
        completedQuestIds: state.completedQuestIds,
        grid: state.grid,
        compostApplications: state.compostApplications,
      });
      // Merge with existing (keep items obtained via trade too)
      const merged = Array.from(new Set([...state.unlockedItems, ...newlyUnlocked]));
      if (merged.length !== state.unlockedItems.length) {
        set({ unlockedItems: merged });
        saveState(get());
      }
    },

    resetGame: () => {
      set(initialState);
      saveState(get());
    },
  };
});
