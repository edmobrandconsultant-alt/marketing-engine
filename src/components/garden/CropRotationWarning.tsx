'use client';

import { checkCropRotation, getFamilyEmoji, getPlantFamily, getFamilyName } from '@/game/crop-rotation';

interface Props {
  plantId: string;
  plotHistory: string[];
}

export function CropRotationWarning({ plantId, plotHistory }: Props) {
  const result = checkCropRotation(plantId, plotHistory);
  const family = getPlantFamily(plantId);

  if (!result.warning && !result.tip) return null;

  const isBonus = result.penalty < 0;

  return (
    <div className={`p-2 rounded text-[10px] ${
      isBonus ? 'bg-green-50 border border-green-200' :
      result.penalty >= 0.2 ? 'bg-red-50 border border-red-200' :
      'bg-amber-50 border border-amber-200'
    }`}>
      <div className="flex items-center gap-1 mb-0.5">
        <span>{getFamilyEmoji(family)}</span>
        <span className={`font-bold ${
          isBonus ? 'text-green-700' : result.penalty >= 0.2 ? 'text-red-700' : 'text-amber-700'
        }`}>
          {isBonus ? 'Rotation Bonus!' : 'Rotation Warning'}
        </span>
        <span className="text-gray-500">({getFamilyName(family)} family)</span>
      </div>
      {result.warning && (
        <p className={`${result.penalty >= 0.2 ? 'text-red-600' : 'text-amber-600'}`}>
          {result.warning}
        </p>
      )}
      {result.tip && (
        <p className={`mt-0.5 ${isBonus ? 'text-green-600' : 'text-emerald-600'}`}>
          {result.tip}
        </p>
      )}
    </div>
  );
}
