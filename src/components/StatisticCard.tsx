import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatisticCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  index?: number;
}

export default function StatisticCard({
  icon: Icon,
  label,
  value,
  color = 'text-primary',
  index = 0,
}: StatisticCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass group rounded-xl p-5 transition-all duration-300 hover:scale-[1.03] hover:border-border-hover"
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-bg-elevated ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-muted">{label}</p>
          <p className="mt-0.5 truncate text-xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
