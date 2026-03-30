'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ActiveWeather, WeatherEvent } from '@/game/weather';
import { isWeatherActive } from '@/game/weather';
import { useState } from 'react';

interface Props {
  weather: ActiveWeather | null;
}

const weatherBgColors: Record<string, string> = {
  sunny: 'bg-amber-100',
  cloudy: 'bg-gray-200',
  rainy: 'bg-blue-100',
  stormy: 'bg-slate-300',
  frost: 'bg-blue-200',
  heatwave: 'bg-red-100',
  windy: 'bg-teal-100',
};

export function WeatherBanner({ weather }: Props) {
  const [showTip, setShowTip] = useState(false);

  if (!weather || !isWeatherActive(weather)) return null;

  const { event } = weather;
  const remaining = Math.max(0, Math.ceil((weather.expiresAt - Date.now()) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
      >
        <button
          onClick={() => setShowTip(!showTip)}
          className={`w-full ${weatherBgColors[event.type] || 'bg-gray-100'} px-3 py-1.5 flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{event.emoji}</span>
            <span className="font-bold text-xs text-gray-800">{event.name}</span>
            <span className="text-[10px] text-gray-600">{event.description}</span>
          </div>
          <span className="text-[10px] font-mono text-gray-500">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </button>

        {showTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${weatherBgColors[event.type] || 'bg-gray-100'} px-3 py-2 border-t border-gray-200`}
          >
            <p className="text-[10px] text-gray-700 leading-relaxed">
              <span className="font-bold">Learn: </span>{event.educational}
            </p>
            <div className="flex gap-2 mt-1 text-[9px] text-gray-500">
              {event.effects.growthMultiplier !== 1 && (
                <span>Growth: {event.effects.growthMultiplier > 1 ? '+' : ''}{Math.round((event.effects.growthMultiplier - 1) * 100)}%</span>
              )}
              {event.effects.waterRegen > 0 && <span>+{event.effects.waterRegen} water</span>}
              {event.effects.frostDamage && <span className="text-red-500 font-bold">Frost damage!</span>}
              {event.effects.waterDrain > 1 && <span className="text-amber-600">Extra thirsty</span>}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
