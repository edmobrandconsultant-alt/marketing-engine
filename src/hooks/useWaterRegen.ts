'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';
import { saveState } from '@/lib/storage';

const MAX_WATER = 50;
const REGEN_INTERVAL_MS = 30_000; // 1 water every 30 seconds
const REGEN_AMOUNT = 1;

export function useWaterRegen() {
  const water = useGameStore(s => s.water);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const state = useGameStore.getState();
      if (state.water < MAX_WATER) {
        const newWater = Math.min(MAX_WATER, state.water + REGEN_AMOUNT);
        useGameStore.setState({ water: newWater });
        saveState(useGameStore.getState());
      }
    }, REGEN_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Also grant offline water on mount (catch-up)
  useEffect(() => {
    const lastSaveRaw = typeof window !== 'undefined' ? localStorage.getItem('wildgrow_last_water_tick') : null;
    const now = Date.now();

    if (lastSaveRaw) {
      const lastTick = parseInt(lastSaveRaw, 10);
      const elapsed = now - lastTick;
      const offlineRegen = Math.floor(elapsed / REGEN_INTERVAL_MS) * REGEN_AMOUNT;
      if (offlineRegen > 0) {
        const state = useGameStore.getState();
        const newWater = Math.min(MAX_WATER, state.water + offlineRegen);
        useGameStore.setState({ water: newWater });
        saveState(useGameStore.getState());
      }
    }

    // Update last tick
    localStorage.setItem('wildgrow_last_water_tick', now.toString());

    // Keep updating the timestamp periodically
    const tickUpdater = setInterval(() => {
      localStorage.setItem('wildgrow_last_water_tick', Date.now().toString());
    }, REGEN_INTERVAL_MS);

    return () => clearInterval(tickUpdater);
  }, []);

  return { water, maxWater: MAX_WATER };
}
