import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  type?: 'tmdb' | 'personal';
}

export default function Rating({
  value,
  maxValue = 10,
  size = 'sm',
  showValue = true,
  type = 'tmdb',
}: RatingProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="inline-flex items-center gap-1">
      <Star
        className={`${sizeClasses[size]} ${
          type === 'tmdb' ? 'fill-warning text-warning' : 'fill-primary text-primary'
        }`}
      />
      {showValue && (
        <span className={`font-semibold text-text-primary ${textSizes[size]}`}>
          {value.toFixed(1)}
          <span className="font-normal text-text-muted">/{maxValue}</span>
        </span>
      )}
    </div>
  );
}
