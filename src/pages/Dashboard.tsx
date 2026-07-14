import { motion } from 'framer-motion';
import {
  Film,
  Bookmark,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { useMovies } from '@/hooks/useMovies';
import { useSearch } from '@/hooks/useSearch';
import SearchBar from '@/components/SearchBar';
import StatisticCard from '@/components/StatisticCard';
import MovieCard from '@/components/MovieCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

export default function Dashboard() {
  const { movies, loading, stats } = useMovies();
  const { query, setQuery, filteredItems: searchResults } = useSearch(
    movies,
    ['title', 'originalTitle'],
    ''
  );

  const recentMovies = (query ? searchResults : movies).slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center lg:text-left"
      >
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Movie<span className="text-gradient">Tracker</span>
        </h1>
        <p className="mt-3 text-base text-text-secondary sm:text-lg">
          Track every movie you've watched and discover your next favorite.
        </p>
      </motion.div>

      {/* Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-2xl"
      >
        <SearchBar value={query} onChange={setQuery} size="lg" />
      </motion.div>

      {/* Statistics */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <LoadingSkeleton type="stat" count={4} />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatisticCard icon={Film} label="Total Movies" value={stats.totalMovies} index={0} />
          <StatisticCard icon={Bookmark} label="Wishlist" value={stats.wishlist} color="text-warning" index={1} />
          <StatisticCard icon={Play} label="Watching" value={stats.watching} color="text-info" index={2} />
          <StatisticCard icon={CheckCircle2} label="Completed" value={stats.completed} color="text-success" index={3} />
        </div>
      ) : null}

      {/* Recently Added */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-4 flex items-center justify-between"
        >
          <h2 className="text-xl font-semibold text-text-primary">
            {query ? 'Search Results' : 'Recently Added'}
          </h2>
          {!query && movies.length > 8 && (
            <a
              href="/movies"
              className="text-sm text-primary transition-colors hover:text-primary-hover"
            >
              View All →
            </a>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <LoadingSkeleton type="card" count={4} />
          </div>
        ) : recentMovies.length === 0 ? (
          <EmptyState
            title={query ? 'No results found' : 'No movies yet'}
            description={
              query
                ? 'Try a different search term.'
                : 'Start building your collection by adding your first movie.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recentMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
