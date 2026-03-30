'use client';

import { useState, useCallback } from 'react';
import { useGameStore } from '@/store/game-store';
import { PlotCellComponent } from './PlotCell';
import { PlantSelector } from './PlantSelector';
import { FeatureSelector } from './FeatureSelector';
import { InfoPanel } from './InfoPanel';
import { Toolbar } from './Toolbar';
import { QuestNotificationToast } from './QuestNotificationToast';
import { calculateCompanionBonus } from '@/game/companion-planting';
import { useQuestTracker, type QuestNotification } from '@/hooks/useQuestTracker';
import { plantMap } from '@/data/plants';

export function GardenGrid() {
  const {
    grid, selectedTool, selectedPlantId, selectedFeatureId,
    plantSeed, waterPlant, harvestPlant,
    applyMulch, applyAnnualCompost, buildFeature,
    currentSeason, lastCompostYear, compost,
  } = useGameStore();

  const { processEvent } = useQuestTracker();

  const [showPlantSelector, setShowPlantSelector] = useState(false);
  const [showFeatureSelector, setShowFeatureSelector] = useState(false);
  const [targetCell, setTargetCell] = useState<{ row: number; col: number } | null>(null);
  const [infoCell, setInfoCell] = useState<{ row: number; col: number } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [questNotification, setQuestNotification] = useState<QuestNotification | null>(null);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  }, []);

  const showQuestNotifications = useCallback((notifications: QuestNotification[]) => {
    if (notifications.length === 0) return;
    // Show one at a time, prioritize quest_complete over task_progress
    const sorted = [...notifications].sort((a, b) =>
      a.type === 'quest_complete' ? -1 : b.type === 'quest_complete' ? 1 : 0
    );
    setQuestNotification(sorted[0]);
    setTimeout(() => setQuestNotification(null), 3500);
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
          const questResults = processEvent({ type: 'plant', plantId: selectedPlantId });
          showQuestNotifications(questResults);
        } else {
          setTargetCell({ row, col });
          setShowPlantSelector(true);
        }
        break;

      case 'water':
        if (cell.plantId) {
          waterPlant(row, col);
          showNotification('Watered!');
          const questResults = processEvent({ type: 'water' });
          showQuestNotifications(questResults);
        } else {
          showNotification('Nothing to water here.');
        }
        break;

      case 'harvest':
        if (cell.plantId && cell.growthStage >= 3) {
          harvestPlant(row, col);
          showNotification('Harvested! +XP +Seeds');
          const questResults = processEvent({ type: 'harvest' });
          showQuestNotifications(questResults);
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
          const questResults = processEvent({ type: 'mulch' });
          showQuestNotifications(questResults);
        } else {
          showNotification('Can\'t mulch here.');
        }
        break;

      case 'compost': {
        // Dowding: 1 inch of compost applied once a year (autumn/winter)
        const currentYear = new Date().getFullYear();
        if (lastCompostYear === currentYear) {
          showNotification('Already composted this year! Dowding says once a year is enough.');
          return;
        }
        if (currentSeason !== 'autumn' && currentSeason !== 'winter') {
          showNotification('Wait for autumn — Dowding applies compost in autumn/winter.');
          return;
        }
        const plotCount = grid.flat().filter(c => !c.featureId).length;
        const needed = Math.ceil(plotCount / 4);
        if (compost < needed) {
          showNotification(`Need ${needed} compost to dress all beds. You have ${compost}.`);
          return;
        }
        applyAnnualCompost();
        showNotification('Annual compost applied! 1 inch on every bed — Dowding style 🌱');
        const questResults = processEvent({ type: 'compost' });
        showQuestNotifications(questResults);
        break;
      }

      case 'build':
        if (!cell.plantId && !cell.featureId) {
          if (selectedFeatureId) {
            buildFeature(row, col);
            showNotification('Feature built!');
            const questResults = processEvent({ type: 'build_feature', featureId: selectedFeatureId });
            showQuestNotifications(questResults);
          } else {
            setShowFeatureSelector(true);
          }
        } else {
          showNotification('This plot is occupied!');
        }
        break;

      case 'info':
        setInfoCell({ row, col });
        break;
    }
  }, [grid, selectedTool, selectedPlantId, selectedFeatureId, plantSeed, waterPlant, harvestPlant, applyMulch, applyAnnualCompost, buildFeature, processEvent, showNotification, showQuestNotifications, currentSeason, lastCompostYear, compost]);

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Notification toast */}
      {notification && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-emerald-900 text-white px-4 py-2 pixel-border-thin text-xs font-bold animate-bounce-in rounded">
          {notification}
        </div>
      )}

      {/* Quest notification */}
      <QuestNotificationToast notification={questNotification} />

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
        onClose={() => { setShowPlantSelector(false); setTargetCell(null); }}
        plotHistory={targetCell ? grid[targetCell.row]?.[targetCell.col]?.plantHistory || [] : []}
        isNoDigBed={targetCell ? grid[targetCell.row]?.[targetCell.col]?.isNoDigBed || false : false}
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
