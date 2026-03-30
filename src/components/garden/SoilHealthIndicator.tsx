'use client';

import type { SoilHealth } from '@/game/soil-health';
import { getSoilRating } from '@/game/soil-health';

interface Props {
  soil: SoilHealth;
  compact?: boolean;
}

export function SoilHealthIndicator({ soil, compact = false }: Props) {
  const rating = getSoilRating(soil);

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-[10px]">
        <span>{rating.emoji}</span>
        <span className={`font-bold ${rating.color}`}>{rating.label}</span>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 p-2 rounded pixel-border-thin space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-800">Soil Health</span>
        <span className={`text-xs font-bold ${rating.color}`}>{rating.emoji} {rating.label}</span>
      </div>

      <SoilBar label="Fertility" value={soil.fertility} color="bg-green-500" emoji="🌿" />
      <SoilBar label="Moisture" value={soil.moisture} color="bg-blue-500" emoji="💧" />
      <SoilBar label="Biology" value={soil.biology} color="bg-amber-600" emoji="🪱" />

      <p className="text-[9px] text-amber-600">
        {soil.fertility < 30 && 'Low fertility! Add compost to restore nutrients. '}
        {soil.moisture < 30 && 'Dry soil! Mulch to retain moisture. '}
        {soil.biology < 30 && 'Low soil life! No-dig methods protect helpful organisms. '}
        {rating.label === 'Excellent' && 'Perfect soil! Your plants are thriving. '}
      </p>
    </div>
  );
}

function SoilBar({ label, value, color, emoji }: { label: string; value: number; color: string; emoji: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] w-4">{emoji}</span>
      <span className="text-[9px] text-gray-600 w-12">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[9px] text-gray-500 w-6 text-right">{Math.round(value)}</span>
    </div>
  );
}
