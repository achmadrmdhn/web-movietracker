import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import type { Movie } from '@/types/movie';
import StatusBadge from './StatusBadge';
import Rating from './Rating';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.03 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-bg-card transition-all duration-300 hover:border-border-hover hover:shadow-lg hover:shadow-black/20"
    >
      <Link to={`/movies/${movie.id}`}>
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* View Details button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
              <Eye className="h-4 w-4" />
              View Details
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute left-3 top-3">
            <StatusBadge status={movie.status} />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="truncate text-sm font-semibold text-text-primary">
            {movie.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-text-muted">{movie.year}</span>
            <span className="text-text-muted">·</span>
            <span className="truncate text-xs text-text-muted">
              {movie.genres.map((g) => g.name).join(', ')}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Rating value={movie.tmdbRating} size="sm" />
            {movie.personalRating && (
              <Rating value={movie.personalRating} size="sm" type="personal" />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
