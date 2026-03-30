import type { Season } from '@/data/plants';

export interface SeasonInfo {
  season: Season;
  name: string;
  emoji: string;
  bgGradient: string;
  description: string;
}

const seasonData: Record<Season, SeasonInfo> = {
  spring: {
    season: 'spring',
    name: 'Spring',
    emoji: '🌱',
    bgGradient: 'from-green-300 to-emerald-200',
    description: 'Time to sow seeds and plan your garden!',
  },
  summer: {
    season: 'summer',
    name: 'Summer',
    emoji: '☀️',
    bgGradient: 'from-yellow-200 to-amber-200',
    description: 'Water well and watch everything grow!',
  },
  autumn: {
    season: 'autumn',
    name: 'Autumn',
    emoji: '🍂',
    bgGradient: 'from-orange-200 to-amber-300',
    description: 'Harvest time! Gather and save seeds.',
  },
  winter: {
    season: 'winter',
    name: 'Winter',
    emoji: '❄️',
    bgGradient: 'from-blue-100 to-slate-200',
    description: 'Plan for next year and mulch your beds.',
  },
};

export function getCurrentSeason(): Season {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export function getSeasonInfo(season?: Season): SeasonInfo {
  return seasonData[season ?? getCurrentSeason()];
}

export function canPlantInSeason(plantSeasons: Season[], season?: Season): boolean {
  const current = season ?? getCurrentSeason();
  return plantSeasons.includes(current);
}
