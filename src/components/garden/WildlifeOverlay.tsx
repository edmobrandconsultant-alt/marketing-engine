'use client';

import { useState } from 'react';
import type { WildlifeVisit } from '@/game/wildlife-engine';

interface WildlifeOverlayProps {
  activeVisitors: WildlifeVisit[];
  gridCols: number;
  gridRows: number;
  onDismiss: (visitId: string) => void;
}

export function WildlifeOverlay({ activeVisitors, gridCols, gridRows, onDismiss }: WildlifeOverlayProps) {
  const [selectedVisit, setSelectedVisit] = useState<string | null>(null);

  if (activeVisitors.length === 0) return null;

  return (
    <>
      {activeVisitors.map(visit => {
        const { visitor, position } = visit;
        // Calculate position as percentage of the grid
        const leftPct = ((position.col + 0.5) / gridCols) * 100;
        const topPct = ((position.row + 0.5) / gridRows) * 100;
        const isSelected = selectedVisit === visit.id;
        // Check if visit is fading out (last 3 seconds)
        const elapsed = Date.now() - visit.startedAt;
        const remaining = visit.duration - elapsed;
        const isFadingOut = remaining < 3000;

        return (
          <div key={visit.id}>
            {/* Visitor sprite */}
            <button
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                animation: isFadingOut
                  ? 'wildlife-fade-out 3s ease-out forwards'
                  : 'wildlife-bob 2s ease-in-out infinite, wildlife-fade-in 0.5s ease-out',
                fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
              }}
              onClick={() => setSelectedVisit(isSelected ? null : visit.id)}
              aria-label={`${visitor.name} visitor`}
            >
              {visitor.emoji}
            </button>

            {/* Info popup */}
            {isSelected && (
              <div
                className="absolute z-20 transform -translate-x-1/2 bg-amber-50 text-emerald-900 pixel-border-thin rounded-lg p-3 text-xs max-w-[200px] shadow-lg"
                style={{
                  left: `${leftPct}%`,
                  top: `${Math.max(topPct - 25, 5)}%`,
                }}
              >
                <div className="font-bold text-sm mb-1">
                  {visitor.emoji} {visitor.name}
                </div>
                <p className="mb-1 text-[10px] leading-tight italic">
                  {visitor.funFacts[Math.floor(Math.random() * visitor.funFacts.length)]}
                </p>
                <div className="text-[10px] mt-1 px-1 py-0.5 bg-emerald-100 rounded inline-block">
                  Bonus: {visitor.bonusType.replace('_', ' ')} x{visitor.bonusMultiplier}
                </div>
                <button
                  className="block mt-2 text-[10px] underline text-emerald-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVisit(null);
                    onDismiss(visit.id);
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes wildlife-bob {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-6px); }
        }
        @keyframes wildlife-fade-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes wildlife-fade-out {
          from { opacity: 1; }
          to { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        }
      `}</style>
    </>
  );
}
