import { motion } from "framer-motion";
import { Info, Code2 } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-text-primary">About</h1>
        <p className="mt-1 text-sm text-text-secondary">A short overview of this website</p>
      </motion.div>

      <div className="max-w-2xl space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="glass rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated">
              <Info className="h-5 w-5 text-info" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary">Website Name</h3>
              <p className="text-xs text-text-muted">Movie Tracker</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="glass rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated">
              <Code2 className="h-5 w-5 text-text-muted" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary">About</h3>
              <p className="text-xs text-text-muted">
                This app helps you track movies and TV series: wishlist, watching, completed, ratings, and personal notes. It also includes statistics so you can review your viewing habits.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="glass rounded-xl p-5">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Technology & Versions</h3>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-secondary">React: ^19.2.7</span>
            <span className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-secondary">TypeScript: ~6.0.2</span>
            <span className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-secondary">Vite: ^8.1.1</span>
            <span className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-secondary">Tailwind CSS: ^4.3.2</span>
            <span className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-secondary">Framer Motion: ^12.42.2</span>
            <span className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-secondary">Recharts: ^3.9.2</span>
            <span className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-secondary">Lucide React: ^1.24.0</span>
            <span className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-secondary">Sonner: ^2.0.7</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="glass rounded-xl p-5">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Code & Contact</h3>
          <p className="mb-3 text-xs text-text-muted">Source code and GitHub profile:</p>
          <a href="https://github.com/achmadrmdhn" target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            GitHub: achmadrmdhn
          </a>
        </motion.div>
      </div>
    </div>
  );
}
