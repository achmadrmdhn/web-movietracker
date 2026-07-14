import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useMovies } from '@/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

export default function Favorites() {
  const { movies, loading } = useMovies();
  const favoriteMovies = movies.filter((m) => m.isFavorite);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-text-primary">Favorites</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Your favorite movies and shows
        </p>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <LoadingSkeleton type="card" count={4} />
        </div>
      ) : favoriteMovies.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Mark movies as favorites to see them here."
          icon={<Heart className="h-10 w-10 text-text-muted" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favoriteMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
