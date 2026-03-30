'use client';

import { useGameStore } from '@/store/game-store';

type Tool = 'plant' | 'water' | 'harvest' | 'mulch' | 'compost' | 'build' | 'info';

const tools: { id: Tool; icon: string; label: string; color: string }[] = [
  { id: 'plant', icon: '🌱', label: 'Plant', color: 'bg-green-600' },
  { id: 'water', icon: '💧', label: 'Water', color: 'bg-blue-600' },
  { id: 'harvest', icon: '🧺', label: 'Harvest', color: 'bg-amber-600' },
  { id: 'mulch', icon: '🍂', label: 'Mulch', color: 'bg-amber-800' },
  { id: 'compost', icon: '🪱', label: 'Compost', color: 'bg-amber-900' },
  { id: 'build', icon: '🔨', label: 'Build', color: 'bg-emerald-700' },
  { id: 'info', icon: '🔍', label: 'Info', color: 'bg-sky-600' },
];

export function Toolbar() {
  const { selectedTool, setTool } = useGameStore();

  return (
    <div className="bg-emerald-800 px-2 py-2 border-t-2 border-emerald-600">
      <div className="flex items-center justify-around gap-1 max-w-lg mx-auto">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`
              flex flex-col items-center py-1 px-2 rounded-lg transition-all
              ${selectedTool === tool.id
                ? `${tool.color} text-white scale-110 pixel-border-thin`
                : 'text-emerald-200 hover:text-white'
              }
            `}
          >
            <span className="text-lg">{tool.icon}</span>
            <span className="text-[8px] font-bold uppercase">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
