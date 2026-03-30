'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { WeatherNotification } from '@/hooks/useWeather';

interface Props {
  notification: WeatherNotification | null;
}

export function WeatherNotificationToast({ notification }: Props) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.event.type + notification.message}
          initial={{ y: -60, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -40, opacity: 0, scale: 0.8 }}
          className="fixed top-28 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-sm"
        >
          <div className="bg-white pixel-border rounded-lg p-3 text-center shadow-lg">
            <div className="text-3xl mb-1">{notification.event.emoji}</div>
            <div className="font-bold text-sm text-gray-800">{notification.event.name}!</div>
            <div className="text-xs text-gray-600 mt-0.5">{notification.message}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
