'use client';

import { plants, plantMap } from '@/data/plants';
import { canPlantInSeason, getCurrentSeason } from '@/game/seasons';
import { useGameStore } from '@/store/game-store';
import { checkCropRotation, getFamilyEmoji, getPlantFamily, getDowndingSequence, getFeedingLevel } from '@/game/crop-rotation';
import { Modal } from '@/components/ui/Modal';

interface PlantSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  plotHistory: string[];
  isNoDigBed?: boolean;
}

const feedingLabels: Record<string, { label: string; color: string }> = {
  heavy: { label: 'Hungry feeder', color: 'bg-red-100 text-red-700' },
  moderate: { label: 'Moderate feeder', color: 'bg-amber-100 text-amber-700' },
  light: { label: 'Light feeder', color: 'bg-green-100 text-green-700' },
  giver: { label: 'Nitrogen fixer', color: 'bg-emerald-100 text-emerald-700' },
};

export function PlantSelector({ isOpen, onClose, plotHistory, isNoDigBed = false }: PlantSelectorProps) {
  const { selectPlant, seeds, difficulty } = useGameStore();
  const season = getCurrentSeason();

  const filteredPlants = plants.filter(p => {
    if (difficulty === 'seedling' && p.difficulty === 'advanced') return false;
    return true;
  });

  const handleSelect = (plantId: string) => {
    selectPlant(plantId);
    onClose();
  };

  // Dowding sequence recommendation based on last plant
  const lastPlant = plotHistory.length > 0 ? plotHistory[plotHistory.length - 1] : null;
  const sequenceHint = lastPlant ? getDowndingSequence(lastPlant) : null;
  const lastPlantName = lastPlant ? plantMap.get(lastPlant)?.name : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose a Plant">
      {seeds <= 0 && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-xs font-bold pixel-border-thin">
          No seeds left! Harvest plants to earn more.
        </div>
      )}

      {/* Dowding sequence recommendation */}
      {sequenceHint && (
        <div className="bg-emerald-50 p-2 rounded pixel-border-thin mb-3">
          <div className="text-[10px] font-bold text-emerald-800 mb-0.5">
            🌿 Dowding says: {lastPlantName && `(after ${lastPlantName})`}
          </div>
          <p className="text-[10px] text-emerald-700">{sequenceHint}</p>
          {isNoDigBed && (
            <p className="text-[9px] text-emerald-600 mt-0.5">
              This is a no-dig bed — soil biology helps suppress disease, giving you more flexibility.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
        {filteredPlants.map(plant => {
          const inSeason = canPlantInSeason(plant.season, season);
          const rotation = checkCropRotation(plant.id, plotHistory, isNoDigBed);
          const family = getPlantFamily(plant.id);
          const feeding = getFeedingLevel(plant.id);
          const feedInfo = feedingLabels[feeding];
          const hasRotationIssue = rotation.penalty > 0;
          const hasRotationBonus = rotation.penalty < 0;

          return (
            <button
              key={plant.id}
              onClick={() => inSeason && seeds > 0 && handleSelect(plant.id)}
              disabled={!inSeason || seeds <= 0}
              className={`
                p-3 rounded-lg text-left pixel-border-thin transition-all
                ${inSeason
                  ? hasRotationIssue
                    ? 'bg-red-50 hover:bg-red-100 cursor-pointer border-red-200'
                    : hasRotationBonus
                      ? 'bg-green-50 hover:bg-green-100 cursor-pointer border-green-200'
                      : 'bg-white hover:bg-green-50 cursor-pointer'
                  : 'bg-gray-100 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{plant.sprite[3]}</span>
                <div>
                  <div className="font-bold text-sm text-emerald-900">{plant.name}</div>
                  <div className="text-[10px] text-emerald-600 uppercase">
                    {getFamilyEmoji(family)} {plant.type}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-600 leading-tight">{plant.description}</p>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {plant.season.map(s => (
                  <span key={s} className={`text-[8px] px-1 rounded ${
                    s === season ? 'bg-green-200 text-green-800 font-bold' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s}
                  </span>
                ))}
                <span className={`text-[8px] px-1 rounded ${feedInfo.color}`}>
                  {feedInfo.label}
                </span>
              </div>
              {!inSeason && (
                <div className="text-[10px] text-red-500 font-bold mt-1">
                  Out of season
                </div>
              )}
              {inSeason && hasRotationIssue && (
                <div className="text-[10px] text-red-600 font-bold mt-1">
                  ⚠️ Same family — growth {Math.round(rotation.penalty * 100)}% slower
                  {isNoDigBed && ' (reduced in no-dig)'}
                </div>
              )}
              {inSeason && hasRotationBonus && (
                <div className="text-[10px] text-green-600 font-bold mt-1">
                  ✨ {rotation.tip?.slice(0, 50)}...
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
