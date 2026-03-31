'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { wildlifeVisitors } from '@/data/wildlife';

interface WildlifeLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WildlifeLog({ isOpen, onClose }: WildlifeLogProps) {
  const discoveredWildlife = useGameStore(s => s.discoveredWildlife);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const discoveredCount = Object.keys(discoveredWildlife).length;
  const totalCount = wildlifeVisitors.length;
  const progressPct = Math.round((discoveredCount / totalCount) * 100);

  const selectedVisitor = selectedId
    ? wildlifeVisitors.find(v => v.id === selectedId)
    : null;
  const isDiscovered = selectedId ? (discoveredWildlife[selectedId] ?? 0) > 0 : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-amber-50 pixel-border rounded-xl max-w-md w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-200">
          <h2 className="text-lg font-bold text-emerald-900">Wildlife Journal</h2>
          <button
            className="text-emerald-700 font-bold text-xl leading-none px-2"
            onClick={onClose}
            aria-label="Close wildlife journal"
          >
            &times;
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between text-xs text-emerald-800 mb-1">
            <span>Species discovered</span>
            <span className="font-bold">{discoveredCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-3 pixel-border-thin">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Species grid or detail view */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedVisitor ? (
            /* Detail view */
            <div>
              <button
                className="text-xs text-emerald-700 underline mb-3"
                onClick={() => setSelectedId(null)}
              >
                Back to all species
              </button>

              {isDiscovered ? (
                <div>
                  <div className="text-center mb-3">
                    <span className="text-4xl">{selectedVisitor.emoji}</span>
                    <h3 className="text-lg font-bold text-emerald-900 mt-1">{selectedVisitor.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      selectedVisitor.rarity === 'rare' ? 'bg-purple-200 text-purple-800' :
                      selectedVisitor.rarity === 'uncommon' ? 'bg-blue-200 text-blue-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {selectedVisitor.rarity}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-800 mb-3">{selectedVisitor.description}</p>

                  <div className="text-xs mb-2">
                    <span className="font-bold text-emerald-900">Visits: </span>
                    <span>{discoveredWildlife[selectedVisitor.id] ?? 0}</span>
                  </div>

                  <div className="text-xs mb-2">
                    <span className="font-bold text-emerald-900">Attracted by: </span>
                    <span>{selectedVisitor.attractedBy.join(', ').replace(/_/g, ' ')}</span>
                  </div>

                  <div className="text-xs mb-2">
                    <span className="font-bold text-emerald-900">Bonus: </span>
                    <span>{selectedVisitor.bonusType.replace('_', ' ')} x{selectedVisitor.bonusMultiplier}</span>
                  </div>

                  <div className="text-xs mb-2">
                    <span className="font-bold text-emerald-900">Active: </span>
                    <span>{selectedVisitor.activeSeasons.join(', ')}</span>
                  </div>

                  <div className="bg-amber-100 rounded-lg p-2 mt-3 pixel-border-thin">
                    <div className="font-bold text-xs text-emerald-900 mb-1">Fun Facts</div>
                    <ul className="list-disc list-inside text-[10px] text-emerald-800 space-y-1">
                      {selectedVisitor.funFacts.map((fact, i) => (
                        <li key={i}>{fact}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 rounded-lg p-2 mt-2 pixel-border-thin">
                    <div className="font-bold text-xs text-red-800 mb-1">Conservation</div>
                    <p className="text-[10px] text-red-700">{selectedVisitor.conservationNote}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3 grayscale opacity-30">
                    {selectedVisitor.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-gray-400">???</h3>
                  <p className="text-xs text-gray-400 mt-2">
                    Build the right features to attract this visitor!
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Hint: needs {selectedVisitor.attractedBy.join(', ').replace(/_/g, ' ')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Grid view */
            <div className="grid grid-cols-4 gap-2">
              {wildlifeVisitors.map(visitor => {
                const visits = discoveredWildlife[visitor.id] ?? 0;
                const discovered = visits > 0;

                return (
                  <button
                    key={visitor.id}
                    className={`flex flex-col items-center p-2 rounded-lg pixel-border-thin transition-colors ${
                      discovered
                        ? 'bg-emerald-50 hover:bg-emerald-100'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedId(visitor.id)}
                  >
                    <span className={`text-2xl ${discovered ? '' : 'grayscale opacity-30'}`}>
                      {visitor.emoji}
                    </span>
                    <span className={`text-[9px] mt-1 font-bold leading-tight text-center ${
                      discovered ? 'text-emerald-800' : 'text-gray-400'
                    }`}>
                      {discovered ? visitor.name : '???'}
                    </span>
                    {discovered && (
                      <span className="text-[8px] text-emerald-600">x{visits}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
