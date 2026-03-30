'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';
import { processGrowth } from '@/game/engine';

export function useGameTick(intervalMs = 5000) {
  const grid = useGameStore(s => s.grid);
  const activeWeather = useGameStore(s => s.activeWeather);
  const updateGrowth = useGameStore(s => s.updateGrowth);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const updates = processGrowth(grid, activeWeather);
      for (const update of updates) {
        updateGrowth(update.row, update.col, update.newStage);
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [grid, activeWeather, updateGrowth, intervalMs]);
}
