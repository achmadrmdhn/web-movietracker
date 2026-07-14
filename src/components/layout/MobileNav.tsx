import { NavLink } from "react-router-dom";
import { LayoutDashboard, Film, Heart, BarChart3, Info } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/movies", icon: Film, label: "Movies" },
  { to: "/favorites", icon: Heart, label: "Favorites" },
  { to: "/statistics", icon: BarChart3, label: "Stats" },
  { to: "/about", icon: Info, label: "About" },
];

export default function MobileNav() {
  return (
    <motion.nav initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-sidebar/95 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${isActive ? "text-primary" : "text-text-muted hover:text-text-secondary"}`}
          >
            {({ isActive }) => (
              <>
                {isActive && <motion.div layoutId="mobile-nav-indicator" className="absolute -top-2 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
