export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
  sprite: string;
}

export const levels: LevelInfo[] = [
  { level: 0, title: 'Seedling', xpRequired: 0, sprite: '🌱' },
  { level: 1, title: 'Sprout', xpRequired: 30, sprite: '🌿' },
  { level: 2, title: 'Grower', xpRequired: 80, sprite: '🪴' },
  { level: 3, title: 'Gardener', xpRequired: 180, sprite: '🌻' },
  { level: 4, title: 'Land Steward', xpRequired: 350, sprite: '🌳' },
  { level: 5, title: 'Master Grower', xpRequired: 600, sprite: '👨‍🌾' },
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
