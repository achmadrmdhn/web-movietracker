import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  type?: 'card' | 'stat' | 'detail' | 'text' | 'chart';
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
      <div className="skeleton aspect-[2/3]" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-5">
      <div className="flex items-center gap-4">
        <div className="skeleton h-11 w-11 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-6 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-[400px] w-full rounded-xl" />
      <div className="flex gap-6">
        <div className="skeleton h-[300px] w-[200px] shrink-0 rounded-xl" />
        <div className="flex-1 space-y-4">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton h-20 w-full rounded" />
        </div>
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-6">
      <div className="skeleton mb-4 h-5 w-40 rounded" />
      <div className="skeleton h-64 w-full rounded-lg" />
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />);
      case 'stat':
        return Array.from({ length: count }).map((_, i) => <SkeletonStat key={i} />);
      case 'detail':
        return <SkeletonDetail />;
      case 'chart':
        return Array.from({ length: count }).map((_, i) => <SkeletonChart key={i} />);
      case 'text':
        return Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-4 w-full rounded" />
        ));
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderSkeleton()}
    </motion.div>
  );
}
