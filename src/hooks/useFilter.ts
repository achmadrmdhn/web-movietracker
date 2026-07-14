import { useState, useMemo } from 'react';
import type { Movie, MovieStatus, SortOption, SortDirection } from '@/types/movie';

export function useFilter(movies: Movie[]) {
  const [statusFilter, setStatusFilter] = useState<MovieStatus | 'all'>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('addedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach(m => m.genres.forEach(g => genres.add(g.name)));
    return Array.from(genres).sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }

    if (genreFilter !== 'all') {
      result = result.filter(m => m.genres.some(g => g.name === genreFilter));
    }

    if (typeFilter !== 'all') {
      result = result.filter(m => m.type === typeFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'rating':
          comparison = a.tmdbRating - b.tmdbRating;
          break;
        case 'addedAt':
          comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [movies, statusFilter, genreFilter, typeFilter, sortBy, sortDirection]);

  return {
    statusFilter,
    setStatusFilter,
    genreFilter,
    setGenreFilter,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    allGenres,
    filteredMovies,
  };
}
