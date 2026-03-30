'use client';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: 'green' | 'blue' | 'gold' | 'red' | 'purple' | 'brown';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const colorMap = {
  green: 'bg-green-500 hover:bg-green-400 text-white',
  blue: 'bg-blue-500 hover:bg-blue-400 text-white',
  gold: 'bg-amber-400 hover:bg-amber-300 text-amber-900',
  red: 'bg-red-500 hover:bg-red-400 text-white',
  purple: 'bg-purple-500 hover:bg-purple-400 text-white',
  brown: 'bg-amber-700 hover:bg-amber-600 text-white',
};

const sizeMap = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function PixelButton({
  children,
  onClick,
  color = 'green',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
}: PixelButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        pixel-btn font-bold uppercase tracking-wider
        ${colorMap[color]} ${sizeMap[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
