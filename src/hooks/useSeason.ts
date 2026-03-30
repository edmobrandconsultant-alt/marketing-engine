'use client';

import { useMemo } from 'react';
import { getCurrentSeason, getSeasonInfo } from '@/game/seasons';

export function useSeason() {
  return useMemo(() => {
    const season = getCurrentSeason();
    return getSeasonInfo(season);
  }, []);
}
