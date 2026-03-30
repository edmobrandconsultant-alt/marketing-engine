'use client';

import { useGameStore } from '@/store/game-store';
import { getLevelForXP, getXPToNextLevel } from '@/game/progression';

export function ResourceBar() {
  const { seeds, water, compost, harvestPoints, xp } = useGameStore();
  const level = getLevelForXP(xp);
  const progress = getXPToNextLevel(xp);

  return (
    <div className="bg-emerald-900 text-white px-3 py-2">
      {/* Level and XP */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{level.sprite}</span>
        <span className="text-xs font-bold uppercase tracking-wider">{level.title}</span>
        <div className="flex-1 pixel-progress rounded-sm">
          <div
            className="pixel-progress-bar"
            style={{ width: `${progress.progress * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-emerald-300">Lv.{level.level}</span>
      </div>

      {/* Resources */}
      <div className="flex items-center justify-between gap-1">
        <div className="resource-pill bg-amber-700 text-amber-100">
          <span>🌱</span>
          <span>{seeds}</span>
        </div>
        <div className="resource-pill bg-blue-700 text-blue-100">
          <span>💧</span>
          <span>{water}</span>
        </div>
        <div className="resource-pill bg-amber-900 text-amber-100">
          <span>🪱</span>
          <span>{compost}</span>
        </div>
        <div className="resource-pill bg-yellow-600 text-yellow-100">
          <span>⭐</span>
          <span>{harvestPoints}</span>
        </div>
      </div>
    </div>
  );
}
