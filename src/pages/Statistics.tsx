import { useMemo } from "react";
import { motion } from "framer-motion";
import { Film, CheckCircle2, Bookmark, Play, XCircle, Heart, Star, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useMovies } from "@/hooks/useMovies";
import StatisticCard from "@/components/StatisticCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const CHART_COLORS = ["#E50914", "#3B82F6", "#22C55E", "#EAB308", "#A855F7", "#EC4899", "#F97316", "#06B6D4"];

export default function Statistics() {
  const { movies, loading, stats } = useMovies();

  // Movies watched per month (last 12 months)
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      months[key] = 0;
    }
    movies
      .filter((m) => m.status === "completed")
      .forEach((m) => {
        const d = new Date(m.addedAt);
        const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        if (key in months) months[key]++;
      });
    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, [movies]);

  // Genre distribution
  const genreData = useMemo(() => {
    const counts: Record<string, number> = {};
    movies.forEach((m) =>
      m.genres.forEach((g) => {
        if (!g?.name) return;
        counts[g.name] = (counts[g.name] || 0) + 1;
      }),
    );
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [movies]);

  // Movie vs TV Series
  const typeData = useMemo(() => {
    const movieCount = movies.filter((m) => m.type === "movie").length;
    const tvCount = movies.filter((m) => m.type === "tv").length;
    return [
      { name: "Movies", value: movieCount },
      { name: "TV Series", value: tvCount },
    ];
  }, [movies]);

  // Status distribution
  const statusData = useMemo(
    () => [
      { name: "Completed", value: movies.filter((m) => m.status === "completed").length },
      { name: "Watching", value: movies.filter((m) => m.status === "watching").length },
      { name: "Wishlist", value: movies.filter((m) => m.status === "wishlist").length },
      { name: "Dropped", value: movies.filter((m) => m.status === "dropped").length },
    ],
    [movies],
  );

  const STATUS_COLORS = ["#22C55E", "#3B82F6", "#EAB308", "#EF4444"];

  const tooltipStyle = {
    contentStyle: {
      background: "#1E1E1E",
      border: "1px solid #2A2A2A",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "13px",
    },
    cursor: { fill: "rgba(229, 9, 20, 0.1)" },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <LoadingSkeleton type="stat" count={8} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LoadingSkeleton type="chart" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-text-primary">Statistics</h1>
        <p className="mt-1 text-sm text-text-secondary">Your movie watching insights</p>
      </motion.div>

      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatisticCard icon={Film} label="Total Movies" value={stats.totalMovies} index={0} />
          <StatisticCard icon={CheckCircle2} label="Completed" value={stats.completed} color="text-success" index={1} />
          <StatisticCard icon={Bookmark} label="Wishlist" value={stats.wishlist} color="text-warning" index={2} />
          <StatisticCard icon={Play} label="Watching" value={stats.watching} color="text-info" index={3} />
          <StatisticCard icon={XCircle} label="Dropped" value={stats.dropped} color="text-danger" index={4} />
          <StatisticCard icon={Heart} label="Favorite Genre" value={stats.favoriteGenre} color="text-primary" index={5} />
          <StatisticCard icon={Star} label="Avg Rating" value={stats.averageRating} color="text-warning" index={6} />
          <StatisticCard icon={Clock} label="Watch Hours" value={`${stats.totalWatchHours}h`} index={7} />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Movies Watched Per Month */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="glass rounded-xl p-6">
          <h3 className="mb-6 text-base font-semibold text-text-primary">Movies Watched Per Month</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={{ stroke: "#2A2A2A" }} />
              <YAxis tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={{ stroke: "#2A2A2A" }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#E50914" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Genre Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="glass rounded-xl p-6">
          <h3 className="mb-6 text-base font-semibold text-text-primary">Genre Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={genreData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {genreData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#A1A1AA" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Movie vs TV Series */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="glass rounded-xl p-6">
          <h3 className="mb-6 text-base font-semibold text-text-primary">Movies vs TV Series</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                <Cell fill="#E50914" />
                <Cell fill="#3B82F6" />
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#A1A1AA" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="glass rounded-xl p-6">
          <h3 className="mb-6 text-base font-semibold text-text-primary">Watching Progress</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={{ stroke: "#2A2A2A" }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={{ stroke: "#2A2A2A" }} width={80} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
