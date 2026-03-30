'use client';

import { useSeason } from '@/hooks/useSeason';

export function SeasonBanner() {
  const season = useSeason();

  return (
    <div className={`bg-gradient-to-r ${season.bgGradient} px-3 py-1.5 flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{season.emoji}</span>
        <span className="font-bold text-sm text-emerald-900">{season.name}</span>
      </div>
      <p className="text-[10px] text-emerald-700">{season.description}</p>
    </div>
  );
}
