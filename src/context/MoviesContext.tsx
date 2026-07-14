import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Movie, MovieStats } from "@/types/movie";
import * as movieService from "@/services/movieService";

type MoviesContextValue = {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  stats: MovieStats | null;
  addMovie: (movie: Partial<Movie>) => Promise<Movie>;
  updateMovie: (id: number, updates: Partial<Movie>) => Promise<Movie | undefined>;
  deleteMovie: (id: number) => Promise<boolean>;
  toggleFavorite: (id: number) => Promise<Movie | undefined>;
  refetch: () => Promise<void>;
};

const MoviesContext = createContext<MoviesContextValue | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MovieStats | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.getMovies();
      setMovies(data);
      setStats(movieService.calculateStats(data));
    } catch {
      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const addMovie = useCallback(async (movie: Partial<Movie>) => {
    const newMovie = await movieService.addMovie(movie);
    setMovies((prev) => {
      const updated = [newMovie, ...prev];
      setStats(movieService.calculateStats(updated));
      return updated;
    });
    return newMovie;
  }, []);

  const updateMovie = useCallback(async (id: number, updates: Partial<Movie>) => {
    const updated = await movieService.updateMovie(id, updates);
    if (updated) {
      setMovies((prev) => {
        const newList = prev.map((m) => (m.id === id ? updated : m));
        setStats(movieService.calculateStats(newList));
        return newList;
      });
    }
    return updated;
  }, []);

  const deleteMovie = useCallback(async (id: number) => {
    const success = await movieService.deleteMovie(id);
    if (success) {
      setMovies((prev) => {
        const newList = prev.filter((m) => m.id !== id);
        setStats(movieService.calculateStats(newList));
        return newList;
      });
    }
    return success;
  }, []);

  const toggleFavorite = useCallback(async (id: number) => {
    const updated = await movieService.toggleFavorite(id);
    if (updated) {
      setMovies((prev) => {
        const newList = prev.map((m) => (m.id === id ? updated : m));
        setStats(movieService.calculateStats(newList));
        return newList;
      });
    }
    return updated;
  }, []);

  const value = useMemo(() => ({ movies, loading, error, stats, addMovie, updateMovie, deleteMovie, toggleFavorite, refetch }), [movies, loading, error, stats, addMovie, updateMovie, deleteMovie, toggleFavorite, refetch]);

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error("useMovies must be used within a MoviesProvider");
  }
  return context;
}
