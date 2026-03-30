'use client';

import { useGameStore } from '@/store/game-store';
import { plantMap } from '@/data/plants';
import { biodiversityMap } from '@/data/biodiversity-features';
import { calculateCompanionBonus } from '@/game/companion-planting';
import { checkCropRotation, getPlantFamily, getFamilyName, getFamilyEmoji } from '@/game/crop-rotation';
import { Modal } from '@/components/ui/Modal';
import { SoilHealthIndicator } from './SoilHealthIndicator';
import { CropRotationWarning } from './CropRotationWarning';

interface InfoPanelProps {
  row: number;
  col: number;
  onClose: () => void;
}

export function InfoPanel({ row, col, onClose }: InfoPanelProps) {
  const grid = useGameStore(s => s.grid);
  const cell = grid[row]?.[col];

  if (!cell) return null;

  const plant = cell.plantId ? plantMap.get(cell.plantId) : null;
  const feature = cell.featureId ? biodiversityMap.get(cell.featureId) : null;
  const companionResult = cell.plantId
    ? calculateCompanionBonus(grid, row, col)
    : null;

  const isEmpty = !plant && !feature;

  return (
    <Modal isOpen={true} onClose={onClose} title={
      plant ? plant.name :
      feature ? feature.name :
      'Empty Plot'
    }>
      {/* Soil health - shown for all non-feature cells */}
      {!feature && (
        <div className="mb-3">
          <SoilHealthIndicator soil={cell.soilHealth} />
        </div>
      )}

      {isEmpty && (
        <div className="text-center py-2">
          <span className="text-4xl">🟤</span>
          <p className="text-sm text-gray-600 mt-2">
            This plot is empty. Use the Plant or Build tool to get started!
          </p>
          {cell.isNoDigBed && (
            <div className="mt-2 bg-green-100 text-green-700 p-2 rounded text-xs">
              This is a no-dig bed! Plants grow 20% faster here.
            </div>
          )}
          {cell.mulched && (
            <div className="mt-2 bg-amber-100 text-amber-700 p-2 rounded text-xs">
              Mulched! Water lasts longer and growth +10%.
            </div>
          )}

          {/* Plot history */}
          {cell.plantHistory.length > 0 && (
            <div className="mt-2 bg-gray-50 p-2 rounded pixel-border-thin text-left">
              <div className="text-xs font-bold text-gray-700 mb-1">Previously Grown Here</div>
              <div className="flex gap-1 flex-wrap">
                {cell.plantHistory.map((id, i) => {
                  const p = plantMap.get(id);
                  const family = getPlantFamily(id);
                  return (
                    <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                      {getFamilyEmoji(family)} {p?.name || id}
                    </span>
                  );
                })}
              </div>
              <p className="text-[9px] text-gray-500 mt-1">
                Rotate plant families for healthier soil!
              </p>
            </div>
          )}
        </div>
      )}

      {plant && (
        <div className="space-y-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              {plant.sprite.map((s, i) => (
                <span
                  key={i}
                  className={`text-2xl ${i === cell.growthStage ? 'scale-125 border-b-2 border-green-500' : 'opacity-40'}`}
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Stage {cell.growthStage + 1} of 4
              {cell.growthStage >= 3 && ' - Ready to harvest!'}
              {cell.frostDamaged && ' - Frost damaged!'}
            </p>
          </div>

          <p className="text-sm text-gray-700">{plant.description}</p>

          {/* Frost damage warning */}
          {cell.frostDamaged && (
            <div className="bg-blue-50 p-2 rounded pixel-border-thin">
              <div className="text-xs font-bold text-blue-700 mb-1">🥶 Frost Damaged!</div>
              <p className="text-[10px] text-blue-600">
                This plant was damaged by frost. Growth has been set back. Mulched beds protect plants from frost!
              </p>
            </div>
          )}

          {/* Crop rotation info */}
          <CropRotationWarning plantId={plant.id} plotHistory={cell.plantHistory} />

          {/* Companion info */}
          {companionResult && companionResult.companions.length > 0 && (
            <div className="bg-green-50 p-2 rounded pixel-border-thin">
              <div className="text-xs font-bold text-green-700 mb-1">Companion Bonus!</div>
              <p className="text-[10px] text-green-600">
                Growing well with: {companionResult.companions.map(id => plantMap.get(id)?.name).join(', ')}
              </p>
            </div>
          )}

          {companionResult && companionResult.antagonists.length > 0 && (
            <div className="bg-red-50 p-2 rounded pixel-border-thin">
              <div className="text-xs font-bold text-red-700 mb-1">Bad Neighbours!</div>
              <p className="text-[10px] text-red-600">
                Clashing with: {companionResult.antagonists.map(id => plantMap.get(id)?.name).join(', ')}
              </p>
            </div>
          )}

          {/* Real world tip */}
          <div className="bg-amber-50 p-2 rounded pixel-border-thin">
            <div className="text-xs font-bold text-amber-700 mb-1">Real Growing Tip</div>
            <p className="text-[10px] text-amber-600">{plant.realWorldTip}</p>
          </div>

          {/* Fun fact */}
          <div className="bg-purple-50 p-2 rounded pixel-border-thin">
            <div className="text-xs font-bold text-purple-700 mb-1">Did You Know?</div>
            <p className="text-[10px] text-purple-600">{plant.funFact}</p>
          </div>
        </div>
      )}

      {feature && (
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-5xl">{feature.sprite}</span>
          </div>

          <p className="text-sm text-gray-700">{feature.description}</p>

          <div className="bg-emerald-50 p-2 rounded pixel-border-thin">
            <div className="text-xs font-bold text-emerald-700 mb-1">Bonus Effect</div>
            <p className="text-[10px] text-emerald-600">{feature.bonus.description}</p>
            <p className="text-[10px] text-emerald-500">Range: {feature.bonus.radius} cells</p>
          </div>

          <div className="bg-amber-50 p-2 rounded pixel-border-thin">
            <div className="text-xs font-bold text-amber-700 mb-1">Real World Tip</div>
            <p className="text-[10px] text-amber-600">{feature.realWorldTip}</p>
          </div>

          <div className="bg-purple-50 p-2 rounded pixel-border-thin">
            <div className="text-xs font-bold text-purple-700 mb-1">Did You Know?</div>
            <p className="text-[10px] text-purple-600">{feature.funFact}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
