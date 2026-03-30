'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { useGameTick } from '@/hooks/useGameTick';
import { ResourceBar } from '@/components/ui/ResourceBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { GardenGrid } from '@/components/garden/GardenGrid';
import { SeasonBanner } from '@/components/garden/SeasonBanner';

export default function GardenPage() {
  const router = useRouter();
  const gameStarted = useGameStore(s => s.gameStarted);

  // Start the game tick (checks plant growth every 5 seconds)
  useGameTick(5000);

  useEffect(() => {
    if (!gameStarted) {
      router.push('/');
    }
  }, [gameStarted, router]);

  if (!gameStarted) return null;

  return (
    <div className="h-full flex flex-col season-spring">
      {/* Top bar */}
      <ResourceBar />
      <SeasonBanner />

      {/* Garden */}
      <GardenGrid />

      {/* Bottom nav */}
      <div className="pb-16">
        <BottomNav />
      </div>
    </div>
  );
}
