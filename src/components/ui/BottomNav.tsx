'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/garden', label: 'Garden', icon: '🌿' },
  { href: '/character', label: 'Character', icon: '👤' },
  { href: '/trading', label: 'Trade', icon: '🤝' },
  { href: '/quests', label: 'Quests', icon: '⚔️' },
  { href: '/almanac', label: 'Almanac', icon: '📖' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-emerald-900 border-t-3 border-emerald-700 z-30">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center py-2 px-3 min-w-[60px]
                transition-colors duration-150
                ${isActive
                  ? 'text-amber-300 bg-emerald-800'
                  : 'text-emerald-300 hover:text-white'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
