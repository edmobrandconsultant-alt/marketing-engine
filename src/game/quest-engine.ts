import { quests, type Quest } from '@/data/quests';
import { plantMap } from '@/data/plants';
import type { GameState, PlotCell } from '@/store/game-store';
import { hasCompanionPair } from '@/game/companion-planting';

export type GameEvent =
  | { type: 'plant'; plantId: string }
  | { type: 'water' }
  | { type: 'harvest' }
  | { type: 'mulch' }
  | { type: 'compost' }
  | { type: 'build_feature'; featureId: string }
  | { type: 'tick' };

interface QuestCheckResult {
  questId: string;
  taskId: string;
  newValue: number;
  justCompleted: boolean;
}

function countUniqueFlowers(grid: PlotCell[][]): number {
  const flowers = new Set<string>();
  for (const row of grid) {
    for (const cell of row) {
      if (cell.plantId) {
        const plant = plantMap.get(cell.plantId);
        if (plant?.type === 'flower') flowers.add(cell.plantId);
      }
    }
  }
  return flowers.size;
}

export function checkQuestProgress(
  event: GameEvent,
  state: GameState,
): QuestCheckResult[] {
  const results: QuestCheckResult[] = [];

  for (const quest of quests) {
    // Skip already completed quests
    if (state.completedQuestIds.includes(quest.id)) continue;

    // Skip quests above player level
    const level = state.getLevel();
    if (quest.unlockLevel > level.level) continue;

    const progress = state.questProgress.find(q => q.questId === quest.id);

    for (const task of quest.tasks) {
      const currentValue = progress?.taskProgress[task.id] || 0;
      if (currentValue >= task.target) continue; // Already done

      const newValue = evaluateTask(quest, task.id, event, state, currentValue);
      if (newValue > currentValue) {
        results.push({
          questId: quest.id,
          taskId: task.id,
          newValue,
          justCompleted: newValue >= task.target,
        });
      }
    }
  }

  return results;
}

function evaluateTask(
  quest: Quest,
  taskId: string,
  event: GameEvent,
  state: GameState,
  currentValue: number,
): number {
  switch (taskId) {
    // first_seed quest
    case 'plant_1':
      if (event.type === 'plant') return currentValue + 1;
      break;

    // water_wise quest
    case 'water_5':
      if (event.type === 'water') return currentValue + 1;
      break;

    // first_harvest quest
    case 'harvest_1':
      if (event.type === 'harvest') return currentValue + 1;
      break;

    // companion_friends quest
    case 'companion_pair':
      if (event.type === 'plant' && hasCompanionPair(state.grid)) return 1;
      break;

    // no_dig_hero quest
    case 'mulch_bed':
      if (event.type === 'mulch') return currentValue + 1;
      break;
    case 'compost_bed':
      if (event.type === 'compost') return currentValue + 1;
      break;

    // biodiversity_builder quest
    case 'add_feature':
      if (event.type === 'build_feature') return currentValue + 1;
      break;

    // pollinator_paradise quest
    case 'plant_flowers_3':
      if (event.type === 'plant') {
        return countUniqueFlowers(state.grid);
      }
      break;

    // Bridge quests - these are manually confirmed by the player
    case 'real_plant':
    case 'spot_species':
    case 'season_obs':
      break;
  }

  return currentValue;
}

export function isQuestFullyComplete(
  quest: Quest,
  taskProgress: Record<string, number>,
): boolean {
  return quest.tasks.every(task => (taskProgress[task.id] || 0) >= task.target);
}
