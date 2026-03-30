'use client';

import { plants } from '@/data/plants';
import { canPlantInSeason, getCurrentSeason } from '@/game/seasons';
import { useGameStore } from '@/store/game-store';
import { Modal } from '@/components/ui/Modal';

interface PlantSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlantSelector({ isOpen, onClose }: PlantSelectorProps) {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose a Plant">
      {seeds <= 0 && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-xs font-bold pixel-border-thin">
          No seeds left! Harvest plants to earn more.
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
        {filteredPlants.map(plant => {
          const inSeason = canPlantInSeason(plant.season, season);

          return (
            <button
              key={plant.id}
              onClick={() => inSeason && seeds > 0 && handleSelect(plant.id)}
              disabled={!inSeason || seeds <= 0}
              className={`
                p-3 rounded-lg text-left pixel-border-thin transition-all
                ${inSeason
                  ? 'bg-white hover:bg-green-50 cursor-pointer'
                  : 'bg-gray-100 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{plant.sprite[3]}</span>
                <div>
                  <div className="font-bold text-sm text-emerald-900">{plant.name}</div>
                  <div className="text-[10px] text-emerald-600 uppercase">{plant.type}</div>
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
                <span className="text-[8px] px-1 rounded bg-blue-100 text-blue-700">
                  {plant.waterNeeds} water
                </span>
              </div>
              {!inSeason && (
                <div className="text-[10px] text-red-500 font-bold mt-1">
                  Out of season
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
