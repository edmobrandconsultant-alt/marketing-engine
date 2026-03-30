'use client';

import { quests } from '@/data/quests';
import { useGameStore } from '@/store/game-store';
import { getLevelForXP } from '@/game/progression';
import { BottomNav } from '@/components/ui/BottomNav';
import { ResourceBar } from '@/components/ui/ResourceBar';

export default function QuestsPage() {
  const { xp, completedQuestIds, questProgress } = useGameStore();
  const level = getLevelForXP(xp);

  const availableQuests = quests.filter(q => q.unlockLevel <= level.level);
  const lockedQuests = quests.filter(q => q.unlockLevel > level.level);

  const getProgress = (questId: string) => {
    return questProgress.find(q => q.questId === questId);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      <ResourceBar />

      {/* Header */}
      <div className="bg-emerald-800 px-4 py-3">
        <h1 className="text-white font-bold text-lg">Quest Board</h1>
        <p className="text-emerald-300 text-xs">Complete quests to learn real growing skills!</p>
      </div>

      {/* Quest type legend */}
      <div className="flex gap-2 px-3 py-2 bg-emerald-700">
        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500 text-white font-bold">Digital</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-white font-bold">Bridge</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-green-500 text-white font-bold">Real World</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollable pb-20 p-3 space-y-3">
        {/* Active quests */}
        {availableQuests.map(quest => {
          const isCompleted = completedQuestIds.includes(quest.id);
          const progress = getProgress(quest.id);
          const typeColor = quest.type === 'digital' ? 'blue' : quest.type === 'bridge' ? 'amber' : 'green';

          return (
            <div
              key={quest.id}
              className={`bg-white p-3 rounded-lg pixel-border-thin ${isCompleted ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-2xl">{isCompleted ? '✅' : quest.category === 'growing' ? '🌱' : quest.category === 'biodiversity' ? '🦋' : quest.category === 'seasonal' ? '🍂' : '🏘️'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-sm">{quest.title}</h3>
                    <span className={`text-[8px] px-1 rounded bg-${typeColor}-100 text-${typeColor}-700 font-bold uppercase`}>
                      {quest.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{quest.description}</p>

                  {/* Tasks */}
                  <div className="mt-2 space-y-1">
                    {quest.tasks.map(task => {
                      const taskProg = progress?.taskProgress[task.id] || 0;
                      const done = taskProg >= task.target;
                      return (
                        <div key={task.id} className="flex items-center gap-1 text-[10px]">
                          <span>{done ? '✅' : '⬜'}</span>
                          <span className={done ? 'line-through text-gray-400' : 'text-gray-700'}>
                            {task.description}
                          </span>
                          <span className="text-gray-400 ml-auto">{taskProg}/{task.target}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center gap-2 mt-2 text-[10px]">
                    <span className="text-amber-600">+{quest.rewardXP} XP</span>
                    <span className="text-green-600">+{quest.rewardSeeds} 🌱</span>
                    <span className="text-amber-800">+{quest.rewardCompost} 🪱</span>
                  </div>
                </div>
              </div>

              {/* Educational content */}
              {!isCompleted && (
                <div className="mt-2 bg-emerald-50 p-2 rounded text-[10px] text-emerald-700">
                  <span className="font-bold">Learn:</span> {quest.educationalContent}
                </div>
              )}
            </div>
          );
        })}

        {/* Locked quests */}
        {lockedQuests.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-gray-400 mt-4">Locked Quests</h2>
            {lockedQuests.map(quest => (
              <div key={quest.id} className="bg-gray-100 p-3 rounded-lg pixel-border-thin opacity-50">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500">{quest.title}</h3>
                    <p className="text-[10px] text-gray-400">Unlocks at Level {quest.unlockLevel}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
