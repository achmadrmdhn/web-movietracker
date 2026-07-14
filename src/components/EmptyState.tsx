import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No movies found',
  description = 'Start building your collection.',
  icon,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-bg-elevated">
        {icon || <Film className="h-10 w-10 text-text-muted" />}
      </div>
      <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-muted">{description}</p>
    </motion.div>
  );
}
