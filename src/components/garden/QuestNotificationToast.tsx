'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { QuestNotification } from '@/hooks/useQuestTracker';

interface Props {
  notification: QuestNotification | null;
}

export function QuestNotificationToast({ notification }: Props) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.message}
          initial={{ y: -60, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -40, opacity: 0, scale: 0.8 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
        >
          <div className={`
            pixel-border rounded-lg p-3 text-center
            ${notification.type === 'quest_complete'
              ? 'bg-amber-100 border-amber-400'
              : 'bg-emerald-100 border-emerald-400'
            }
          `}>
            <div className="text-2xl mb-1">
              {notification.type === 'quest_complete' ? '🎉' : '✅'}
            </div>
            <div className="font-bold text-sm text-emerald-900">
              {notification.type === 'quest_complete' ? 'Quest Complete!' : 'Task Done!'}
            </div>
            <div className="text-xs text-emerald-700 mt-0.5">
              {notification.questTitle}
            </div>
            {notification.type === 'quest_complete' && (
              <div className="flex items-center justify-center gap-3 mt-2 text-xs font-bold">
                {notification.rewardXP && (
                  <span className="text-amber-700">+{notification.rewardXP} XP</span>
                )}
                {notification.rewardSeeds && (
                  <span className="text-green-700">+{notification.rewardSeeds} 🌱</span>
                )}
                {notification.rewardCompost && (
                  <span className="text-amber-800">+{notification.rewardCompost} 🪱</span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
