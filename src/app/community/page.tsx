'use client';

import { BottomNav } from '@/components/ui/BottomNav';
import { ResourceBar } from '@/components/ui/ResourceBar';

const upcomingFeatures = [
  {
    icon: '🏘️',
    title: 'Local Market Gardens',
    description: 'Connect with real market gardens in your area. Visit, volunteer, and learn from experienced growers!',
  },
  {
    icon: '🎉',
    title: 'Community Celebrations',
    description: 'Host and attend harvest festivals, seed swaps, and growing workshops in your neighbourhood.',
  },
  {
    icon: '👨‍🌾',
    title: 'Growing Together',
    description: 'Join forces with other WildGrow players to create shared community gardens and food forests.',
  },
  {
    icon: '📚',
    title: 'Education Events',
    description: 'Attend workshops on composting, biodiversity, no-dig growing, and more - taught by real land workers.',
  },
  {
    icon: '🌍',
    title: 'Global Growing Map',
    description: 'See what other WildGrow players are growing around the world. Share tips and celebrate together!',
  },
];

export default function CommunityPage() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-emerald-50">
      <ResourceBar />

      {/* Header */}
      <div className="bg-emerald-800 px-4 py-3">
        <h1 className="text-white font-bold text-lg">Community Hub</h1>
        <p className="text-emerald-300 text-xs">Growing is better together!</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollable pb-20 p-4">
        {/* Coming soon banner */}
        <div className="bg-emerald-100 pixel-border rounded-lg p-4 mb-4 text-center">
          <span className="text-4xl block mb-2">🌱</span>
          <h2 className="font-bold text-emerald-900 text-lg mb-1">Growing Soon!</h2>
          <p className="text-sm text-emerald-700">
            The community features are sprouting! Keep playing to unlock the
            ability to connect with real growers in your area.
          </p>
        </div>

        {/* Feature previews */}
        <h3 className="font-bold text-sm text-gray-700 mb-2">What&apos;s Coming</h3>
        <div className="space-y-3">
          {upcomingFeatures.map((feature, i) => (
            <div key={i} className="bg-white p-3 rounded-lg pixel-border-thin">
              <div className="flex items-start gap-2">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">{feature.title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vision statement */}
        <div className="mt-4 bg-amber-50 p-4 rounded-lg pixel-border-thin">
          <h3 className="font-bold text-sm text-amber-800 mb-1">Our Vision</h3>
          <p className="text-xs text-amber-700 leading-relaxed">
            WildGrow isn&apos;t just a game - it&apos;s a movement. We believe every child
            should have the chance to connect with the land, grow their own food,
            and understand how nature works. Through market gardens, community
            events, and shared celebrations, we&apos;re building a future generation of
            land stewards who know how to feed themselves and care for the earth.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
