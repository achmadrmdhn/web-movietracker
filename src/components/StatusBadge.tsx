import type { MovieStatus } from '@/types/movie';

const statusConfig: Record<MovieStatus, { label: string; className: string }> = {
  wishlist: {
    label: 'Wishlist',
    className: 'bg-warning/15 text-warning border border-warning/30',
  },
  watching: {
    label: 'Watching',
    className: 'bg-info/15 text-info border border-info/30',
  },
  completed: {
    label: 'Completed',
    className: 'bg-success/15 text-success border border-success/30',
  },
  dropped: {
    label: 'Dropped',
    className: 'bg-danger/15 text-danger border border-danger/30',
  },
};

interface StatusBadgeProps {
  status: MovieStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.className} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {config.label}
    </span>
  );
}
