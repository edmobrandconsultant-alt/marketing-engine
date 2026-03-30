import type { Season } from '@/data/plants';
import { getCurrentSeason } from './seasons';

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'frost' | 'heatwave' | 'windy';

export interface WeatherEvent {
  type: WeatherType;
  name: string;
  emoji: string;
  description: string;
  duration: number;           // ms
  effects: WeatherEffects;
  educational: string;
}

export interface WeatherEffects {
  growthMultiplier: number;   // affects all plant growth speed
  waterRegen: number;         // bonus water regen (rain = free water)
  frostDamage: boolean;       // kills tender plants if unprotected
  waterDrain: number;         // extra water consumption (heatwave)
  pollination: number;        // affects fruit/flower production
}

export interface ActiveWeather {
  event: WeatherEvent;
  startedAt: number;
  expiresAt: number;
}

const weatherPool: Record<Season, WeatherType[]> = {
  spring: ['sunny', 'cloudy', 'rainy', 'windy', 'frost'],
  summer: ['sunny', 'sunny', 'heatwave', 'rainy', 'stormy'],
  autumn: ['cloudy', 'rainy', 'windy', 'stormy', 'sunny'],
  winter: ['frost', 'frost', 'cloudy', 'rainy', 'windy'],
};

const weatherData: Record<WeatherType, Omit<WeatherEvent, 'duration'>> = {
  sunny: {
    type: 'sunny',
    name: 'Sunny',
    emoji: '☀️',
    description: 'Clear skies and warm sunshine. Perfect growing conditions!',
    effects: {
      growthMultiplier: 1.15,
      waterRegen: 0,
      frostDamage: false,
      waterDrain: 1,
      pollination: 1.2,
    },
    educational: 'Sunlight is energy! Plants use photosynthesis to convert sunlight into food. Most vegetables need 6-8 hours of sun per day.',
  },
  cloudy: {
    type: 'cloudy',
    name: 'Cloudy',
    emoji: '☁️',
    description: 'Overcast skies. Plants still grow, just a bit slower.',
    effects: {
      growthMultiplier: 0.9,
      waterRegen: 0,
      frostDamage: false,
      waterDrain: 0,
      pollination: 0.8,
    },
    educational: 'Even on cloudy days, plants get enough light to photosynthesize. Some crops like lettuce and spinach actually prefer partial shade!',
  },
  rainy: {
    type: 'rainy',
    name: 'Rainy',
    emoji: '🌧️',
    description: 'Rain is falling! Your plants get free watering.',
    effects: {
      growthMultiplier: 1.1,
      waterRegen: 3,
      frostDamage: false,
      waterDrain: -2,
      pollination: 0.7,
    },
    educational: 'Rainwater is better for plants than tap water because it contains nitrogen from the atmosphere. Collect it in a water butt!',
  },
  stormy: {
    type: 'stormy',
    name: 'Stormy',
    emoji: '⛈️',
    description: 'Heavy storms! Lots of rain but wind can stress plants.',
    effects: {
      growthMultiplier: 0.8,
      waterRegen: 5,
      frostDamage: false,
      waterDrain: -3,
      pollination: 0.3,
    },
    educational: 'Tall plants like sweetcorn and runner beans need staking to survive storms. Hedgerows and trees act as windbreaks to protect gardens.',
  },
  frost: {
    type: 'frost',
    name: 'Frost',
    emoji: '🥶',
    description: 'Frost warning! Tender plants may be damaged unless protected.',
    effects: {
      growthMultiplier: 0.5,
      waterRegen: 0,
      frostDamage: true,
      waterDrain: 0,
      pollination: 0,
    },
    educational: 'Frost forms when temperatures drop below 0°C. Real gardeners use fleece, cloches, or cold frames to protect tender plants. Hardy plants like kale and leeks survive frost!',
  },
  heatwave: {
    type: 'heatwave',
    name: 'Heatwave',
    emoji: '🔥',
    description: 'Scorching heat! Plants need extra water to survive.',
    effects: {
      growthMultiplier: 1.0,
      waterRegen: -1,
      frostDamage: false,
      waterDrain: 3,
      pollination: 1.1,
    },
    educational: 'During heatwaves, water in the early morning or evening - never midday! Mulch helps soil retain moisture. This is why no-dig beds are brilliant in hot weather.',
  },
  windy: {
    type: 'windy',
    name: 'Windy',
    emoji: '💨',
    description: 'Strong winds! Good for drying soil but tough on tall plants.',
    effects: {
      growthMultiplier: 0.95,
      waterRegen: 0,
      frostDamage: false,
      waterDrain: 1,
      pollination: 0.9,
    },
    educational: 'Wind helps strengthen plant stems through a process called thigmomorphogenesis. But too much wind dries out soil and can snap tall stems.',
  },
};

// Plants that are tender (damaged by frost)
export const TENDER_PLANTS = ['tomato', 'basil', 'bean', 'sweetcorn', 'potato', 'nasturtium'];
// Plants that are hardy (survive frost)
export const HARDY_PLANTS = ['cabbage', 'carrot', 'onion', 'pea', 'rosemary', 'lettuce', 'radish', 'parsley', 'lavender'];

export function generateWeatherEvent(): WeatherEvent {
  const season = getCurrentSeason();
  const pool = weatherPool[season];
  const type = pool[Math.floor(Math.random() * pool.length)];
  const data = weatherData[type];

  // Duration: 2-5 minutes of real time
  const duration = (2 + Math.floor(Math.random() * 3)) * 60 * 1000;

  return { ...data, duration };
}

export function isWeatherActive(weather: ActiveWeather | null): boolean {
  if (!weather) return false;
  return Date.now() < weather.expiresAt;
}

export function getWeatherGrowthMultiplier(weather: ActiveWeather | null): number {
  if (!weather || !isWeatherActive(weather)) return 1.0;
  return weather.event.effects.growthMultiplier;
}

export function shouldApplyFrostDamage(weather: ActiveWeather | null, plantId: string, mulched: boolean): boolean {
  if (!weather || !isWeatherActive(weather)) return false;
  if (!weather.event.effects.frostDamage) return false;
  // Mulched beds protect from frost
  if (mulched) return false;
  return TENDER_PLANTS.includes(plantId);
}
