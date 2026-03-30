'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/game-store';
import { PixelButton } from '@/components/ui/PixelButton';
import type { DifficultyMode } from '@/store/game-store';

export default function HomePage() {
  const router = useRouter();
  const { gameStarted, startGame, playerName } = useGameStore();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('seedling');
  const [showNewGame, setShowNewGame] = useState(false);

  const handleStart = () => {
    if (!name.trim()) return;
    startGame(name.trim(), difficulty);
    router.push('/garden');
  };

  const handleContinue = () => {
    router.push('/garden');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-emerald-800 via-emerald-700 to-green-900 p-6">
      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4 animate-float">🌿</div>
        <h1 className="text-4xl font-bold text-white tracking-wider mb-2">
          WildGrow
        </h1>
        <p className="text-emerald-200 text-sm max-w-xs mx-auto">
          Plant seeds. Grow food. Build habitats. Become a land steward!
        </p>
      </motion.div>

      {/* Decorative pixel plants */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 mb-8 text-3xl"
      >
        <span className="animate-float" style={{ animationDelay: '0s' }}>🌻</span>
        <span className="animate-float" style={{ animationDelay: '0.5s' }}>🍅</span>
        <span className="animate-float" style={{ animationDelay: '1s' }}>🦋</span>
        <span className="animate-float" style={{ animationDelay: '1.5s' }}>🐝</span>
        <span className="animate-float" style={{ animationDelay: '2s' }}>🌸</span>
      </motion.div>

      {/* Menu */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-xs space-y-3"
      >
        {gameStarted && !showNewGame && (
          <>
            <PixelButton onClick={handleContinue} color="green" size="lg" fullWidth>
              Continue as {playerName}
            </PixelButton>
            <PixelButton onClick={() => setShowNewGame(true)} color="brown" size="md" fullWidth>
              New Game
            </PixelButton>
          </>
        )}

        {(!gameStarted || showNewGame) && (
          <div className="bg-emerald-900/60 rounded-lg p-4 pixel-border space-y-4">
            <div>
              <label className="block text-emerald-200 text-xs font-bold uppercase mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Young Grower..."
                maxLength={20}
                className="w-full px-3 py-2 bg-emerald-950 text-white rounded pixel-border-thin placeholder:text-emerald-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-emerald-200 text-xs font-bold uppercase mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDifficulty('seedling')}
                  className={`p-3 rounded pixel-border-thin text-center transition-all ${
                    difficulty === 'seedling'
                      ? 'bg-green-500 text-white'
                      : 'bg-emerald-800 text-emerald-300'
                  }`}
                >
                  <span className="text-2xl block">🌱</span>
                  <span className="text-xs font-bold block mt-1">Seedling</span>
                  <span className="text-[10px] block text-emerald-200">Ages 6-9</span>
                </button>
                <button
                  onClick={() => setDifficulty('explorer')}
                  className={`p-3 rounded pixel-border-thin text-center transition-all ${
                    difficulty === 'explorer'
                      ? 'bg-green-500 text-white'
                      : 'bg-emerald-800 text-emerald-300'
                  }`}
                >
                  <span className="text-2xl block">🌿</span>
                  <span className="text-xs font-bold block mt-1">Explorer</span>
                  <span className="text-[10px] block text-emerald-200">Ages 10-14</span>
                </button>
              </div>
            </div>

            <PixelButton
              onClick={handleStart}
              color="gold"
              size="lg"
              fullWidth
              disabled={!name.trim()}
            >
              Start Growing!
            </PixelButton>

            {showNewGame && (
              <PixelButton
                onClick={() => setShowNewGame(false)}
                color="brown"
                size="sm"
                fullWidth
              >
                Back
              </PixelButton>
            )}
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-[10px] text-emerald-400 text-center"
      >
        Learn real growing skills through play
      </motion.p>
    </div>
  );
}
