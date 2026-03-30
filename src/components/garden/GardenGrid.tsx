'use client';

import { useState, useCallback } from 'react';
import { useGameStore } from '@/store/game-store';
import { PlotCellComponent } from './PlotCell';
import { PlantSelector } from './PlantSelector';
import { FeatureSelector } from './FeatureSelector';
import { InfoPanel } from './InfoPanel';
import { Toolbar } from './Toolbar';
import { calculateCompanionBonus } from '@/game/companion-planting';
import { plantMap } from '@/data/plants';

export function GardenGrid() {
  const {
    grid, selectedTool, selectedPlantId,
    plantSeed, waterPlant, harvestPlant,
    applyMulch, applyCompost, buildFeature,
  } = useGameStore();

  const [showPlantSelector, setShowPlantSelector] = useState(false);
  const [showFeatureSelector, setShowFeatureSelector] = useState(false);
  const [infoCell, setInfoCell] = useState<{ row: number; col: number } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    const cell = grid[row][col];

    switch (selectedTool) {
      case 'plant':
        if (cell.plantId || cell.featureId) {
          showNotification('This plot is occupied!');
          return;
        }
        if (selectedPlantId) {
          plantSeed(row, col);
          showNotification(`Planted ${plantMap.get(selectedPlantId)?.name}!`);
        } else {
          setShowPlantSelector(true);
        }
        break;

      case 'water':
        if (cell.plantId) {
          waterPlant(row, col);
          showNotification('Watered!');
        } else {
          showNotification('Nothing to water here.');
        }
        break;

      case 'harvest':
        if (cell.plantId && cell.growthStage >= 3) {
          harvestPlant(row, col);
          showNotification('Harvested! +XP +Seeds');
        } else if (cell.plantId) {
          showNotification('Not ready yet! Keep growing.');
        } else {
          showNotification('Nothing to harvest here.');
        }
        break;

      case 'mulch':
        if (!cell.featureId && !cell.mulched) {
          applyMulch(row, col);
          showNotification('Mulch applied! Growth +10%');
        } else {
          showNotification('Can\'t mulch here.');
        }
        break;

      case 'compost':
        if (!cell.featureId && !cell.isNoDigBed) {
          applyCompost(row, col);
          showNotification('No-dig bed created! Growth +20%');
        } else {
          showNotification('Already prepared!');
        }
        break;

      case 'build':
        if (!cell.plantId && !cell.featureId) {
          setShowFeatureSelector(true);
        } else {
          showNotification('This plot is occupied!');
        }
        break;

      case 'info':
        setInfoCell({ row, col });
        break;
    }
  }, [grid, selectedTool, selectedPlantId, plantSeed, waterPlant, harvestPlant, applyMulch, applyCompost, showNotification]);

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Notification toast */}
      {notification && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-emerald-900 text-white px-4 py-2 pixel-border-thin text-xs font-bold animate-bounce-in rounded">
          {notification}
        </div>
      )}

      {/* Garden Grid */}
      <div className="flex-1 flex items-center justify-center p-3">
        <div
          className="grid gap-1 w-full max-w-sm"
          style={{
            gridTemplateColumns: `repeat(${grid[0]?.length || 6}, 1fr)`,
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const companionResult = cell.plantId
                ? calculateCompanionBonus(grid, r, c)
                : { companions: [], antagonists: [] };

              return (
                <PlotCellComponent
                  key={`${r}-${c}`}
                  cell={cell}
                  row={r}
                  col={c}
                  isCompanion={companionResult.companions.length > 0}
                  isAntagonist={companionResult.antagonists.length > 0}
                  onClick={handleCellClick}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar />

      {/* Modals */}
      <PlantSelector
        isOpen={showPlantSelector}
        onClose={() => setShowPlantSelector(false)}
      />
      <FeatureSelector
        isOpen={showFeatureSelector}
        onClose={() => setShowFeatureSelector(false)}
      />
      {infoCell && (
        <InfoPanel
          row={infoCell.row}
          col={infoCell.col}
          onClose={() => setInfoCell(null)}
        />
      )}
    </div>
  );
}
