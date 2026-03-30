'use client';

import { biodiversityFeatures } from '@/data/biodiversity-features';
import { useGameStore } from '@/store/game-store';
import { getLevelForXP } from '@/game/progression';
import { getAvailableFeatures } from '@/data/garden-stages';
import { Modal } from '@/components/ui/Modal';

interface FeatureSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeatureSelector({ isOpen, onClose }: FeatureSelectorProps) {
  const { selectFeature, seeds, compost, xp, setTool, gardenStageId } = useGameStore();
  const level = getLevelForXP(xp);
  const availableFeatureIds = getAvailableFeatures(gardenStageId);

  const handleSelect = (featureId: string) => {
    selectFeature(featureId as 'pond');
    setTool('build');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Build Wildlife Feature">
      <p className="text-xs text-emerald-700 mb-3">
        Add biodiversity features to boost your garden and help wildlife!
      </p>

      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {biodiversityFeatures.map(feature => {
          const stageUnlocked = availableFeatureIds.includes(feature.id);
          const unlocked = level.level >= feature.unlockLevel && stageUnlocked;
          const affordable = seeds >= feature.cost.seeds && compost >= feature.cost.compost;

          return (
            <button
              key={feature.id}
              onClick={() => unlocked && affordable && handleSelect(feature.id)}
              disabled={!unlocked || !affordable}
              className={`
                w-full p-3 rounded-lg text-left pixel-border-thin transition-all
                ${unlocked && affordable
                  ? 'bg-white hover:bg-emerald-50 cursor-pointer'
                  : 'bg-gray-100 opacity-60 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{feature.sprite}</span>
                <div className="flex-1">
                  <div className="font-bold text-sm text-emerald-900">{feature.name}</div>
                  <div className="text-[10px] text-emerald-600">{feature.bonus.description}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1 text-[10px]">
                <span className={`px-1 rounded ${seeds >= feature.cost.seeds ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  🌱 {feature.cost.seeds}
                </span>
                <span className={`px-1 rounded ${compost >= feature.cost.compost ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  🪱 {feature.cost.compost}
                </span>
                {!unlocked && (
                  <span className="px-1 rounded bg-purple-100 text-purple-700">
                    Unlocks at Lv.{feature.unlockLevel}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
