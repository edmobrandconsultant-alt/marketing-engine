'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { useGameTick } from '@/hooks/useGameTick';
import { useWaterRegen } from '@/hooks/useWaterRegen';
import { useWeather } from '@/hooks/useWeather';
import { useSeason } from '@/hooks/useSeason';
import { ResourceBar } from '@/components/ui/ResourceBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { GardenGrid } from '@/components/garden/GardenGrid';
import { SeasonBanner } from '@/components/garden/SeasonBanner';
import { WeatherBanner } from '@/components/garden/WeatherBanner';
import { WeatherNotificationToast } from '@/components/garden/WeatherNotificationToast';
import { Tutorial } from '@/components/garden/Tutorial';

export default function GardenPage() {
  const router = useRouter();
  const gameStarted = useGameStore(s => s.gameStarted);
  const season = useSeason();

  // Start the game tick (checks plant growth every 5 seconds)
  useGameTick(5000);

  // Water regeneration (1 water every 30 seconds, max 50)
  useWaterRegen();

  // Weather system (random events every ~1 minute)
  const { activeWeather, notification: weatherNotification } = useWeather();

  useEffect(() => {
    if (!gameStarted) {
      router.push('/');
    }
  }, [gameStarted, router]);

  if (!gameStarted) return null;

  return (
    <div className={`h-full flex flex-col season-${season.season}`}>
      {/* Top bar */}
      <ResourceBar />
      <SeasonBanner />
      <WeatherBanner weather={activeWeather} />

      {/* Weather notification */}
      <WeatherNotificationToast notification={weatherNotification} />

      {/* Garden */}
      <GardenGrid />

      {/* Tutorial overlay (first time only) */}
      <Tutorial />

      {/* Bottom nav */}
      <div className="pb-16">
        <BottomNav />
      </div>
    </div>
  );
}
