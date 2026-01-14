import React from 'react';
import { Scan } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
        <Scan className={`${sizeClasses[size]} text-primary relative z-10`} />
      </div>
      {showText && (
        <span className={`font-bold ${textClasses[size]} tracking-tight`}>
          Log<span className="text-gradient-primary">Lens</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
