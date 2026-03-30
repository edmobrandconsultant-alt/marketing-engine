'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/store/game-store';
import { checkQuestProgress, isQuestFullyComplete, type GameEvent } from '@/game/quest-engine';
import { quests } from '@/data/quests';

export interface QuestNotification {
  type: 'task_progress' | 'quest_complete';
  questTitle: string;
  message: string;
  rewardXP?: number;
  rewardSeeds?: number;
  rewardCompost?: number;
}

export function useQuestTracker() {
  const updateQuestProgress = useGameStore(s => s.updateQuestProgress);
  const completeQuest = useGameStore(s => s.completeQuest);
  const addXP = useGameStore(s => s.addXP);
  const addResources = useGameStore(s => s.addResources);

  const processEvent = useCallback((event: GameEvent): QuestNotification[] => {
    const state = useGameStore.getState();
    const results = checkQuestProgress(event, state);
    const notifications: QuestNotification[] = [];

    for (const result of results) {
      // Update task progress (set absolute value, not increment)
      const currentProgress = state.questProgress.find(q => q.questId === result.questId);
      const currentValue = currentProgress?.taskProgress[result.taskId] || 0;
      const increment = result.newValue - currentValue;
      if (increment > 0) {
        updateQuestProgress(result.questId, result.taskId, increment);
      }

      const quest = quests.find(q => q.id === result.questId);
      if (!quest) continue;

      // Check if the whole quest is now complete
      const updatedState = useGameStore.getState();
      const updatedProgress = updatedState.questProgress.find(q => q.questId === result.questId);
      const taskProgress = updatedProgress?.taskProgress || {};

      if (isQuestFullyComplete(quest, taskProgress) && !updatedState.completedQuestIds.includes(quest.id)) {
        completeQuest(quest.id);
        addXP(quest.rewardXP);
        addResources(quest.rewardSeeds, quest.rewardCompost);

        notifications.push({
          type: 'quest_complete',
          questTitle: quest.title,
          message: `Quest complete! "${quest.title}"`,
          rewardXP: quest.rewardXP,
          rewardSeeds: quest.rewardSeeds,
          rewardCompost: quest.rewardCompost,
        });
      } else if (result.justCompleted) {
        notifications.push({
          type: 'task_progress',
          questTitle: quest.title,
          message: `Task done in "${quest.title}"`,
        });
      }
    }

    return notifications;
  }, [updateQuestProgress, completeQuest, addXP, addResources]);

  return { processEvent };
}
