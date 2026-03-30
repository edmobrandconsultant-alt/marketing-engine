'use client';

import { memo } from 'react';
import type { PlotCell as PlotCellType } from '@/store/game-store';
import { plantMap } from '@/data/plants';
import { biodiversityMap } from '@/data/biodiversity-features';

interface PlotCellProps {
  cell: PlotCellType;
  row: number;
  col: number;
  isCompanion: boolean;
  isAntagonist: boolean;
  onClick: (row: number, col: number) => void;
}

function PlotCellInner({ cell, row, col, isCompanion, isAntagonist, onClick }: PlotCellProps) {
  const plant = cell.plantId ? plantMap.get(cell.plantId) : null;
  const feature = cell.featureId ? biodiversityMap.get(cell.featureId) : null;
  const isReady = cell.growthStage >= 3 && cell.plantId;

  // Determine cell visual class
  let cellClass = 'garden-cell garden-cell--empty';
  if (feature) cellClass = 'garden-cell garden-cell--feature';
  else if (cell.isNoDigBed && cell.mulched) cellClass = 'garden-cell garden-cell--no-dig';
  else if (cell.mulched) cellClass = 'garden-cell garden-cell--mulched';
  else if (cell.plantId) cellClass = 'garden-cell garden-cell--planted';

  if (isReady) cellClass += ' garden-cell--ready';
  if (isCompanion) cellClass += ' companion-glow';
  if (isAntagonist) cellClass += ' antagonist-glow';

  // Get sprite for current growth stage
  const sprite = plant
    ? plant.sprite[cell.growthStage] || plant.sprite[plant.sprite.length - 1]
    : feature
      ? feature.sprite
      : null;

  // Show soil decorations
  const showMulch = cell.mulched && !feature;
  const showNoDig = cell.isNoDigBed && !cell.mulched && !feature;

  return (
    <button
      className={`${cellClass} w-full aspect-square flex items-center justify-center relative rounded-sm`}
      onClick={() => onClick(row, col)}
      aria-label={
        plant ? `${plant.name} (stage ${cell.growthStage + 1}/4)` :
        feature ? feature.name :
        'Empty plot'
      }
    >
      {/* Soil indicators */}
      {showMulch && (
        <span className="absolute bottom-0 left-0 text-[6px] opacity-60">
          ///
        </span>
      )}
      {showNoDig && (
        <span className="absolute bottom-0 right-0 text-[8px]">
          🪱
        </span>
      )}

      {/* Main sprite */}
      {sprite && (
        <span
          className={`text-2xl sm:text-3xl ${
            cell.growthStage > 0 && plant ? 'animate-plant-grow' : ''
          } ${isReady ? 'animate-float' : ''}`}
        >
          {sprite}
        </span>
      )}

      {/* Watered indicator */}
      {cell.wateredAt && Date.now() - cell.wateredAt < 60000 && (
        <span className="absolute top-0 right-0 text-[10px] animate-water">
          💧
        </span>
      )}

      {/* Ready to harvest sparkle */}
      {isReady && (
        <span className="absolute top-0 left-0 text-[10px] animate-sparkle">
          ✨
        </span>
      )}
    </button>
  );
}

export const PlotCellComponent = memo(PlotCellInner);
