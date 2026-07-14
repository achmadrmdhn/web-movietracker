import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Film, Heart, BarChart3, Info, Clapperboard } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/movies", icon: Film, label: "Movies" },
  { to: "/favorites", icon: Heart, label: "Favorites" },
  { to: "/statistics", icon: BarChart3, label: "Statistics" },
  { to: "/about", icon: Info, label: "About" },
];

export default function Sidebar() {
  return (
    <motion.aside initial={{ x: -80 }} animate={{ x: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Clapperboard className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-text-primary">
          Movie<span className="text-primary">Tracker</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <motion.div layoutId="sidebar-indicator" className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <p className="text-xs text-text-muted">Movie Tracker v1.0</p>
        <p className="mt-0.5 text-xs text-text-muted">© 2026 All rights reserved</p>
      </div>
    </motion.aside>
  );
}
