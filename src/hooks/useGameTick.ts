'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';
import { processGrowth } from '@/game/engine';

export function useGameTick(intervalMs = 5000) {
  const grid = useGameStore(s => s.grid);
  const updateGrowth = useGameStore(s => s.updateGrowth);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const updates = processGrowth(grid);
      for (const update of updates) {
        updateGrowth(update.row, update.col, update.newStage);
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [grid, updateGrowth, intervalMs]);
}
