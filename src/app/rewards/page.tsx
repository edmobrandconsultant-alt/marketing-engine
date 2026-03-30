'use client';

import { rewards } from '@/data/rewards';
import { useGameStore } from '@/store/game-store';
import { BottomNav } from '@/components/ui/BottomNav';
import { ResourceBar } from '@/components/ui/ResourceBar';

export default function RewardsPage() {
  const { harvestPoints } = useGameStore();

  const digitalRewards = rewards.filter(r => r.type === 'digital');
  const realWorldRewards = rewards.filter(r => r.type === 'real-world');

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-yellow-50 to-amber-50">
      <ResourceBar />

      {/* Header */}
      <div className="bg-emerald-800 px-4 py-3">
        <h1 className="text-white font-bold text-lg">Reward Shop</h1>
        <p className="text-emerald-300 text-xs">Spend harvest points on upgrades and real-world prizes!</p>
      </div>

      {/* Points balance */}
      <div className="bg-amber-500 px-4 py-2 flex items-center justify-center gap-2">
        <span className="text-lg">⭐</span>
        <span className="text-white font-bold">{harvestPoints} Harvest Points</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollable pb-20 p-3 space-y-4">
        {/* Digital rewards */}
        <div>
          <h2 className="font-bold text-sm text-emerald-800 mb-2">Game Upgrades</h2>
          <div className="grid grid-cols-2 gap-2">
            {digitalRewards.map(reward => {
              const canAfford = harvestPoints >= reward.cost;
              return (
                <div
                  key={reward.id}
                  className={`bg-white p-3 rounded-lg pixel-border-thin ${!canAfford ? 'opacity-60' : ''}`}
                >
                  <span className="text-3xl block text-center mb-1">{reward.sprite}</span>
                  <h3 className="font-bold text-xs text-center">{reward.name}</h3>
                  <p className="text-[10px] text-gray-500 text-center mt-0.5">{reward.description}</p>
                  <div className="text-center mt-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      canAfford ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      ⭐ {reward.cost}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-world rewards */}
        <div>
          <h2 className="font-bold text-sm text-emerald-800 mb-2">Real-World Prizes</h2>
          <div className="bg-emerald-50 p-3 rounded-lg pixel-border-thin mb-2">
            <p className="text-xs text-emerald-700">
              Earn enough harvest points and you can win real seeds, tools, and growing kits delivered to you!
              These rewards are coming soon.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {realWorldRewards.map(reward => (
              <div key={reward.id} className="bg-white p-3 rounded-lg pixel-border-thin opacity-70">
                <span className="text-3xl block text-center mb-1">{reward.sprite}</span>
                <h3 className="font-bold text-xs text-center">{reward.name}</h3>
                <p className="text-[10px] text-gray-500 text-center mt-0.5">{reward.description}</p>
                <div className="text-center mt-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                    ⭐ {reward.cost}
                  </span>
                </div>
                <p className="text-[8px] text-center text-amber-600 font-bold mt-1">COMING SOON</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
