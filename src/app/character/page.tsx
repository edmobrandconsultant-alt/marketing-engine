'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { ResourceBar } from '@/components/ui/ResourceBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Modal } from '@/components/ui/Modal';
import { characterItems, getItemById, itemsByCategory } from '@/data/character-items';
import type { ItemCategory, ItemRarity, CharacterItem } from '@/data/character-items';

const categoryLabels: Record<ItemCategory, { label: string; icon: string }> = {
  hat: { label: 'Hats', icon: '👒' },
  outfit: { label: 'Outfits', icon: '👔' },
  tool: { label: 'Tools', icon: '🔧' },
  accessory: { label: 'Accessories', icon: '💎' },
  seeds: { label: 'Seeds', icon: '🌱' },
  special: { label: 'Special', icon: '⭐' },
};

const rarityColors: Record<ItemRarity, string> = {
  common: 'bg-stone-200 text-stone-700 border-stone-300',
  uncommon: 'bg-green-100 text-green-700 border-green-300',
  rare: 'bg-blue-100 text-blue-700 border-blue-300',
  legendary: 'bg-amber-100 text-amber-700 border-amber-400',
};

const rarityBg: Record<ItemRarity, string> = {
  common: 'bg-stone-100 border-stone-300',
  uncommon: 'bg-green-50 border-green-300',
  rare: 'bg-blue-50 border-blue-300',
  legendary: 'bg-amber-50 border-amber-400',
};

function getUnlockProgress(item: CharacterItem, state: {
  level: number;
  totalHarvests: number;
  gardenStageId: number;
  totalPlanted: number;
  completedQuestIds: string[];
  compostApplications: number;
}): number {
  const cond = item.unlockCondition;
  switch (cond.type) {
    case 'starter': return 1;
    case 'level': return Math.min(1, state.level / cond.threshold);
    case 'harvest': return Math.min(1, state.totalHarvests / cond.threshold);
    case 'gardenStage': return Math.min(1, state.gardenStageId / cond.threshold);
    case 'plantTrees': return 0; // can't easily track partial
    case 'questsComplete': return Math.min(1, state.completedQuestIds.length / cond.threshold);
    case 'soilHealth': return 0;
    case 'compost':
    case 'secret':
      return Math.min(1, state.compostApplications / cond.threshold);
    default: return 0;
  }
}

export default function CharacterPage() {
  const router = useRouter();
  const gameStarted = useGameStore(s => s.gameStarted);
  const unlockedItems = useGameStore(s => s.unlockedItems);
  const equippedItems = useGameStore(s => s.equippedItems);
  const equipItem = useGameStore(s => s.equipItem);
  const unequipSlot = useGameStore(s => s.unequipSlot);
  const checkItemUnlocks = useGameStore(s => s.checkItemUnlocks);
  const xp = useGameStore(s => s.xp);
  const totalHarvests = useGameStore(s => s.totalHarvests);
  const gardenStageId = useGameStore(s => s.gardenStageId);
  const totalPlanted = useGameStore(s => s.totalPlanted);
  const completedQuestIds = useGameStore(s => s.completedQuestIds);
  const compostApplications = useGameStore(s => s.compostApplications);
  const getLevel = useGameStore(s => s.getLevel);

  const [activeTab, setActiveTab] = useState<ItemCategory>('hat');
  const [selectedItem, setSelectedItem] = useState<CharacterItem | null>(null);

  useEffect(() => {
    if (!gameStarted) {
      router.push('/');
      return;
    }
    checkItemUnlocks();
  }, [gameStarted, router, checkItemUnlocks]);

  if (!gameStarted) return null;

  const level = getLevel();

  const stateForProgress = {
    level: level.level,
    totalHarvests,
    gardenStageId,
    totalPlanted,
    completedQuestIds,
    compostApplications,
  };

  // Build avatar display
  const hatEmoji = equippedItems.hat ? getItemById(equippedItems.hat)?.emoji : '🧢';
  const outfitEmoji = equippedItems.outfit ? getItemById(equippedItems.outfit)?.emoji : '👕';
  const toolEmoji = equippedItems.tool ? getItemById(equippedItems.tool)?.emoji : '';
  const accessoryEmoji = equippedItems.accessory ? getItemById(equippedItems.accessory)?.emoji : '';

  const categories = Object.keys(categoryLabels) as ItemCategory[];
  const currentItems = itemsByCategory[activeTab];

  return (
    <div className="h-full flex flex-col">
      <ResourceBar />

      <div className="flex-1 overflow-y-auto p-3 pb-20">
        {/* Avatar Display */}
        <div className="bg-emerald-50 pixel-border rounded-lg p-4 mb-4 text-center">
          <h2 className="font-bold text-emerald-900 mb-2">Your Character</h2>
          <div className="flex items-center justify-center gap-1 text-4xl mb-3">
            <span title="Hat">{hatEmoji}</span>
            <span title="Outfit">{outfitEmoji}</span>
            {toolEmoji && <span title="Tool">{toolEmoji}</span>}
            {accessoryEmoji && <span title="Accessory">{accessoryEmoji}</span>}
          </div>

          {/* Equipped slots */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            {(['hat', 'outfit', 'tool', 'accessory'] as const).map(slot => {
              const itemId = equippedItems[slot];
              const item = itemId ? getItemById(itemId) : null;
              return (
                <div key={slot} className="bg-white pixel-border-thin rounded p-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold mb-0.5">{slot}</div>
                  {item ? (
                    <button
                      onClick={() => unequipSlot(slot)}
                      className="w-full text-center"
                      title={`Unequip ${item.name}`}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <div className="text-[9px] text-stone-600 truncate">{item.name}</div>
                    </button>
                  ) : (
                    <div className="text-lg text-stone-300">—</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`
                flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-bold whitespace-nowrap
                transition-colors
                ${activeTab === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }
              `}
            >
              <span>{categoryLabels[cat].icon}</span>
              <span>{categoryLabels[cat].label}</span>
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-3 gap-2">
          {currentItems.map(item => {
            const isUnlocked = unlockedItems.includes(item.id);
            const isEquipped = Object.values(equippedItems).includes(item.id);
            const progress = getUnlockProgress(item, stateForProgress);
            const isClose = !isUnlocked && progress >= 0.5;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isUnlocked) {
                    setSelectedItem(item);
                  } else {
                    setSelectedItem(item);
                  }
                }}
                className={`
                  relative p-2 rounded text-center transition-all
                  ${isUnlocked
                    ? `${rarityBg[item.rarity]} border-2 hover:scale-105`
                    : 'bg-stone-200 border-2 border-stone-300 opacity-60'
                  }
                  ${isEquipped ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}
                `}
              >
                <div className="text-2xl mb-1">
                  {isUnlocked ? item.emoji : '❓'}
                </div>
                <div className={`text-[10px] font-bold truncate ${isUnlocked ? 'text-stone-800' : 'text-stone-500'}`}>
                  {isUnlocked ? item.name : (item.unlockCondition.type === 'secret' ? '???' : item.unlockCondition.description)}
                </div>
                {isEquipped && (
                  <div className="absolute top-0.5 right-0.5 text-[8px] bg-emerald-500 text-white rounded px-1">
                    ON
                  </div>
                )}
                {isClose && !isUnlocked && (
                  <div className="mt-1">
                    <div className="w-full h-1 bg-stone-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <div className="text-[8px] text-amber-600 mt-0.5">{Math.round(progress * 100)}%</div>
                  </div>
                )}
                <div className={`text-[8px] mt-0.5 inline-block px-1 rounded ${rarityColors[item.rarity]}`}>
                  {item.rarity}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name ?? ''}
      >
        {selectedItem && (
          <div>
            <div className="text-center mb-3">
              <span className="text-5xl">{unlockedItems.includes(selectedItem.id) ? selectedItem.emoji : '❓'}</span>
            </div>
            <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 ${rarityColors[selectedItem.rarity]}`}>
              {selectedItem.rarity}
            </div>
            <p className="text-sm text-stone-700 mb-2">{selectedItem.description}</p>
            <div className="bg-amber-50 pixel-border-thin rounded p-2 mb-3">
              <p className="text-xs text-amber-800 italic">&quot;{selectedItem.flavorText}&quot;</p>
            </div>
            {unlockedItems.includes(selectedItem.id) ? (
              <div className="flex gap-2">
                {['hat', 'outfit', 'tool', 'accessory'].includes(selectedItem.category) && (
                  Object.values(equippedItems).includes(selectedItem.id) ? (
                    <button
                      onClick={() => {
                        unequipSlot(selectedItem.category as 'hat' | 'outfit' | 'tool' | 'accessory');
                        setSelectedItem(null);
                      }}
                      className="pixel-btn bg-red-400 text-white px-4 py-2 text-sm flex-1"
                    >
                      Unequip
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        equipItem(selectedItem.id);
                        setSelectedItem(null);
                      }}
                      className="pixel-btn bg-emerald-600 text-white px-4 py-2 text-sm flex-1"
                    >
                      Equip
                    </button>
                  )
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-stone-500 font-bold">
                  {selectedItem.unlockCondition.type === 'secret'
                    ? 'This is a secret item! Keep exploring...'
                    : `Locked: ${selectedItem.unlockCondition.description}`
                  }
                </p>
                {getUnlockProgress(selectedItem, stateForProgress) > 0 && (
                  <div className="mt-2">
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${getUnlockProgress(selectedItem, stateForProgress) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-amber-600">
                      {Math.round(getUnlockProgress(selectedItem, stateForProgress) * 100)}% complete
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      <BottomNav />
    </div>
  );
}
