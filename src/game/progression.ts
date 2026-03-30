export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
  sprite: string;
}

export const levels: LevelInfo[] = [
  { level: 0, title: 'Seedling', xpRequired: 0, sprite: '🌱' },
  { level: 1, title: 'Sprout', xpRequired: 30, sprite: '🌿' },
  { level: 2, title: 'Grower', xpRequired: 80, sprite: '🪴' },           // Allotment unlocks
  { level: 3, title: 'Gardener', xpRequired: 180, sprite: '🌻' },        // Market Garden unlocks
  { level: 4, title: 'Market Gardener', xpRequired: 350, sprite: '🧑‍🌾' }, // Community Farm unlocks
  { level: 5, title: 'Land Steward', xpRequired: 600, sprite: '🌳' },    // 1-Acre Farm unlocks
  { level: 6, title: 'Community Grower', xpRequired: 900, sprite: '🏘️' },
  { level: 7, title: 'Food Forest Keeper', xpRequired: 1300, sprite: '🌲' },
  { level: 8, title: 'Regenerative Farmer', xpRequired: 1800, sprite: '🦋' },
  { level: 9, title: 'Master Grower', xpRequired: 2500, sprite: '👨‍🌾' },
  { level: 10, title: 'Earth Guardian', xpRequired: 3500, sprite: '🌍' },
];

export function getLevelForXP(xp: number): LevelInfo {
  let current = levels[0];
  for (const level of levels) {
    if (xp >= level.xpRequired) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getXPToNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const currentLevel = getLevelForXP(xp);
  const nextLevel = levels.find(l => l.level === currentLevel.level + 1);

  if (!nextLevel) {
    return { current: xp, needed: 0, progress: 1 };
  }

  const currentLevelXP = xp - currentLevel.xpRequired;
  const neededXP = nextLevel.xpRequired - currentLevel.xpRequired;

  return {
    current: currentLevelXP,
    needed: neededXP,
    progress: currentLevelXP / neededXP,
  };
}
