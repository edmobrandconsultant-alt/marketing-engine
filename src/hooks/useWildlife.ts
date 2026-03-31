'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import type { WildlifeVisit } from '@/game/wildlife-engine';
import { generateVisits } from '@/game/wildlife-engine';

const WILDLIFE_CHECK_INTERVAL = 20_000; // check every 20 seconds

export function useWildlife() {
  const grid = useGameStore(s => s.grid);
  const currentSeason = useGameStore(s => s.currentSeason);
  const discoverWildlife = useGameStore(s => s.discoverWildlife);

  const [activeVisitors, setActiveVisitors] = useState<WildlifeVisit[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeVisit = useCallback((visitId: string) => {
    setActiveVisitors(prev => prev.filter(v => v.id !== visitId));
    const timer = timersRef.current.get(visitId);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(visitId);
    }
  }, []);

  const dismissVisitor = useCallback((visitId: string) => {
    removeVisit(visitId);
  }, [removeVisit]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const state = useGameStore.getState();
      setActiveVisitors(prev => {
        // Clean up expired visitors
        const now = Date.now();
        const stillActive = prev.filter(v => now - v.startedAt < v.duration);

        // Generate new visits
        const newVisits = generateVisits(state.grid, state.currentSeason, stillActive.length);

        // Register discovery and expiry timers for new visits
        for (const visit of newVisits) {
          state.discoverWildlife(visit.visitor.id);

          const timer = setTimeout(() => {
            removeVisit(visit.id);
          }, visit.duration);
          timersRef.current.set(visit.id, timer);
        }

        return [...stillActive, ...newVisits];
      });
    }, WILDLIFE_CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Clean up all timers
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, [removeVisit]);

  return { activeVisitors, dismissVisitor };
}
