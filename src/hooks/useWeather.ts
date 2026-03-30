'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/store/game-store';
import { generateWeatherEvent, isWeatherActive, shouldApplyFrostDamage } from '@/game/weather';
import type { ActiveWeather, WeatherEvent } from '@/game/weather';

const WEATHER_CHECK_INTERVAL = 15_000; // check every 15 seconds
const MIN_GAP_BETWEEN_EVENTS = 60_000; // minimum 1 minute between events

export interface WeatherNotification {
  event: WeatherEvent;
  message: string;
}

export function useWeather() {
  const activeWeather = useGameStore(s => s.activeWeather);
  const setWeather = useGameStore(s => s.setWeather);
  const grid = useGameStore(s => s.grid);
  const applyFrostDamage = useGameStore(s => s.applyFrostDamage);
  const [notification, setNotification] = useState<WeatherNotification | null>(null);
  const lastEventEnd = useRef<number>(0);
  const frostApplied = useRef<boolean>(false);

  const showNotification = useCallback((event: WeatherEvent, message: string) => {
    setNotification({ event, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = useGameStore.getState().activeWeather;

      // If there's active weather, check if it expired
      if (current && !isWeatherActive(current)) {
        setWeather(null);
        frostApplied.current = false;
        lastEventEnd.current = Date.now();
        return;
      }

      // If there's active frost weather, apply frost damage once
      if (current && isWeatherActive(current) && current.event.effects.frostDamage && !frostApplied.current) {
        frostApplied.current = true;
        const currentGrid = useGameStore.getState().grid;
        for (let r = 0; r < currentGrid.length; r++) {
          for (let c = 0; c < currentGrid[0].length; c++) {
            const cell = currentGrid[r][c];
            if (cell.plantId && shouldApplyFrostDamage(current, cell.plantId, cell.mulched)) {
              applyFrostDamage(r, c);
            }
          }
        }
        showNotification(current.event, 'Frost is damaging tender plants! Mulched beds are protected.');
      }

      // No active weather - maybe generate a new event
      if (!current) {
        const timeSinceLast = Date.now() - lastEventEnd.current;
        if (timeSinceLast < MIN_GAP_BETWEEN_EVENTS) return;

        // 30% chance every check
        if (Math.random() < 0.3) {
          const event = generateWeatherEvent();
          const now = Date.now();
          const weather: ActiveWeather = {
            event,
            startedAt: now,
            expiresAt: now + event.duration,
          };
          setWeather(weather);
          showNotification(event, event.description);
        }
      }
    }, WEATHER_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [setWeather, applyFrostDamage, showNotification]);

  return { activeWeather, notification };
}
