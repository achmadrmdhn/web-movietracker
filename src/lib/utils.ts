import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'wishlist':
      return 'text-warning bg-warning-bg border-warning/30';
    case 'watching':
      return 'text-info bg-info-bg border-info/30';
    case 'completed':
      return 'text-success bg-success-bg border-success/30';
    case 'dropped':
      return 'text-danger bg-danger-bg border-danger/30';
    default:
      return 'text-text-secondary bg-bg-elevated border-border';
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
