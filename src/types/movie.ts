export type MovieStatus = "wishlist" | "watching" | "completed" | "dropped";

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  tmdbId?: number | null;
  title: string;
  originalTitle: string;
  year: number;
  releaseDate: string;
  runtime: number; // in minutes
  genres: Genre[];
  tmdbRating: number;
  personalRating: number | null;
  status: MovieStatus;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  cast: CastMember[];
  director: string;
  production: string;
  trailerUrl: string | null;
  notes: string;
  isFavorite: boolean;
  addedAt: string;
  type: "movie" | "tv";
}

export interface MovieStats {
  totalMovies: number;
  wishlist: number;
  watching: number;
  completed: number;
  dropped: number;
  totalWatchHours: number;
  favoriteGenre: string;
  averageRating: number;
}

export interface SearchResult {
  id: number;
  title: string;
  year: number;
  overview: string;
  posterUrl: string;
  type: "movie" | "tv";
}

export type SortOption = "title" | "year" | "rating" | "addedAt";
export type SortDirection = "asc" | "desc";
