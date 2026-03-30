'use client';

import { checkCropRotation, getFamilyEmoji, getPlantFamily, getFamilyName, getDowndingSequence } from '@/game/crop-rotation';

interface Props {
  plantId: string;
  plotHistory: string[];
  isNoDigBed?: boolean;
}

export function CropRotationWarning({ plantId, plotHistory, isNoDigBed = false }: Props) {
  const result = checkCropRotation(plantId, plotHistory, isNoDigBed);
  const family = getPlantFamily(plantId);

  // Nothing to show
  if (!result.warning && !result.tip && !result.dowdingNote) return null;

  const isBonus = result.penalty < 0;
  const isSevere = result.penalty >= 0.2;

  return (
    <div className={`p-2 rounded pixel-border-thin space-y-1.5 ${
      isBonus ? 'bg-green-50 border-green-200' :
      isSevere ? 'bg-red-50 border-red-200' :
      result.penalty > 0 ? 'bg-amber-50 border-amber-200' :
      'bg-emerald-50 border-emerald-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-1">
        <span>{getFamilyEmoji(family)}</span>
        <span className={`text-[10px] font-bold ${
          isBonus ? 'text-green-700' : isSevere ? 'text-red-700' :
          result.penalty > 0 ? 'text-amber-700' : 'text-emerald-700'
        }`}>
          {isBonus ? 'Rotation Bonus!' :
           result.penalty > 0 ? 'Rotation Warning' :
           'Rotation Info'}
        </span>
        <span className="text-[9px] text-gray-500">({getFamilyName(family)} family)</span>
        {result.penalty !== 0 && (
          <span className={`text-[9px] font-bold ml-auto ${isBonus ? 'text-green-600' : 'text-red-600'}`}>
            {isBonus ? '+' : ''}{Math.round(-result.penalty * 100)}% growth
          </span>
        )}
      </div>

      {/* Warning */}
      {result.warning && (
        <p className={`text-[10px] ${isSevere ? 'text-red-600' : 'text-amber-600'}`}>
          {result.warning}
        </p>
      )}

      {/* Educational tip */}
      {result.tip && (
        <p className={`text-[10px] ${isBonus ? 'text-green-600' : 'text-emerald-600'}`}>
          {result.tip}
        </p>
      )}

      {/* Dowding note - the key educational content */}
      {result.dowdingNote && (
        <div className="bg-white/60 p-1.5 rounded mt-1">
          <p className="text-[10px] text-emerald-700">
            <span className="font-bold">Charles Dowding says: </span>
            {result.dowdingNote}
          </p>
        </div>
      )}
    </div>
  );
}

// Compact version for the PlantSelector
export function CropRotationBadge({ plantId, plotHistory, isNoDigBed = false }: Props) {
  const result = checkCropRotation(plantId, plotHistory, isNoDigBed);

  if (result.penalty === 0 && !result.dowdingNote) return null;

  const isBonus = result.penalty < 0;

  if (isBonus) {
    return (
      <div className="text-[10px] text-green-600 font-bold mt-1">
        ✨ {result.penalty <= -0.15 ? 'Nitrogen bonus from legumes!' : 'Good rotation choice!'}
      </div>
    );
  }

  if (result.penalty > 0) {
    return (
      <div className="text-[10px] text-red-600 font-bold mt-1">
        ⚠️ Same family{isNoDigBed ? ' (reduced in no-dig)' : ''} — growth {Math.round(result.penalty * 100)}% slower
      </div>
    );
  }

  if (result.dowdingNote) {
    return (
      <div className="text-[10px] text-emerald-600 mt-1">
        🌿 {result.dowdingNote.slice(0, 60)}...
      </div>
    );
  }

  return null;
}
