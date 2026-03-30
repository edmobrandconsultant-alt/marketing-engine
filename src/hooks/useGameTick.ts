'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';
import { processGrowth } from '@/game/engine';
import { countCompostLoos } from '@/game/biodiversity';

export function useGameTick(intervalMs = 5000) {
  const grid = useGameStore(s => s.grid);
  const activeWeather = useGameStore(s => s.activeWeather);
  const updateGrowth = useGameStore(s => s.updateGrowth);
  const addResources = useGameStore(s => s.addResources);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const compostTickRef = useRef(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const updates = processGrowth(grid, activeWeather);
      for (const update of updates) {
        updateGrowth(update.row, update.col, update.newStage);
      }

      // Compost loos generate bonus compost (1 per loo every ~60 seconds)
      const loos = countCompostLoos(grid);
      if (loos > 0) {
        compostTickRef.current++;
        if (compostTickRef.current >= 12) { // 12 ticks × 5s = 60 seconds
          addResources(0, loos);
          compostTickRef.current = 0;
        }
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [grid, activeWeather, updateGrowth, addResources, intervalMs]);
}
