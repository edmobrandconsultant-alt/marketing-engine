'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelButton } from '@/components/ui/PixelButton';

interface TutorialStep {
  title: string;
  message: string;
  icon: string;
  highlight?: string; // which tool to highlight
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to WildGrow!',
    icon: '🌿',
    message: 'You have your very own garden plot! Let\'s learn how to grow things and help wildlife thrive.',
  },
  {
    title: 'Plant a Seed',
    icon: '🌱',
    message: 'Tap the Plant tool at the bottom, choose a plant, then tap an empty plot to plant it! Check which plants are in season right now.',
    highlight: 'plant',
  },
  {
    title: 'Water Your Plants',
    icon: '💧',
    message: 'Switch to the Water tool and tap your planted seeds. Watered plants grow faster! Your water refills over time.',
    highlight: 'water',
  },
  {
    title: 'Harvest When Ready',
    icon: '🧺',
    message: 'When plants sparkle with stars, they\'re ready! Use the Harvest tool to collect them and earn seeds, XP, and harvest points.',
    highlight: 'harvest',
  },
  {
    title: 'Companion Planting',
    icon: '🤝',
    message: 'Some plants help each other grow! Place tomatoes next to basil for a bonus. Green glow = good neighbours, red glow = bad neighbours.',
  },
  {
    title: 'Build for Wildlife',
    icon: '🐝',
    message: 'Use the Build tool to add ponds, bug hotels, and wildflower meadows. These boost nearby plants AND help real wildlife!',
    highlight: 'build',
  },
  {
    title: 'No-Dig Growing',
    icon: '🪱',
    message: 'Use Mulch and Compost tools on empty plots before planting. No-dig beds grow plants faster — just like real no-dig gardens!',
    highlight: 'mulch',
  },
  {
    title: 'Complete Quests',
    icon: '⚔️',
    message: 'Check the Quest board for missions that teach real growing skills. Some quests will even challenge you to grow things for real!',
  },
  {
    title: 'You\'re Ready!',
    icon: '🌻',
    message: 'Explore your Almanac to learn about every plant, check the Quest board for goals, and most importantly — have fun growing!',
  },
];

const TUTORIAL_KEY = 'wildgrow_tutorial_complete';

export function Tutorial() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(TUTORIAL_KEY);
    if (!done) {
      setVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem(TUTORIAL_KEY, 'true');
      setVisible(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  const current = tutorialSteps[step];
  const isLast = step === tutorialSteps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4 pb-24"
      >
        <motion.div
          key={step}
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-emerald-50 pixel-border rounded-lg p-5 w-full max-w-sm"
        >
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step ? 'bg-emerald-600 scale-125' :
                  i < step ? 'bg-emerald-400' : 'bg-emerald-200'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="text-center text-5xl mb-3 animate-bounce-in">
            {current.icon}
          </div>

          {/* Title */}
          <h3 className="text-center font-bold text-lg text-emerald-900 mb-2">
            {current.title}
          </h3>

          {/* Message */}
          <p className="text-center text-sm text-emerald-700 leading-relaxed mb-4">
            {current.message}
          </p>

          {/* Buttons */}
          <div className="flex gap-2">
            {!isLast && (
              <button
                onClick={handleSkip}
                className="flex-1 py-2 text-xs text-emerald-500 font-bold uppercase"
              >
                Skip
              </button>
            )}
            <div className={isLast ? 'w-full' : 'flex-1'}>
              <PixelButton
                onClick={handleNext}
                color={isLast ? 'gold' : 'green'}
                size="md"
                fullWidth
              >
                {isLast ? 'Let\'s Grow!' : 'Next'}
              </PixelButton>
            </div>
          </div>

          {/* Step counter */}
          <p className="text-center text-[10px] text-emerald-400 mt-2">
            {step + 1} of {tutorialSteps.length}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
