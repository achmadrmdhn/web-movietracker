import { movies as dummyMovies, searchResults as dummySearchResults } from "@/data/movies";
import * as tmdbService from "@/services/tmdbService";
import { supabase, hasSupabase } from "@/lib/supabase";
import type { CastMember, Genre, Movie, MovieStats, SearchResult } from "@/types/movie";
import { delay } from "@/lib/utils";

let moviesData = [...dummyMovies];

function toNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "string" ? Number(value) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function toOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value.trim() ? value : null;
}

function parseArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeGenres(value: unknown): Genre[] {
  return parseArray<any>(value)
    .map((genre) => ({
      id: toNumber(genre?.id, 0),
      name: toStringValue(genre?.name, "").trim(),
    }))
    .filter((genre) => genre.name);
}

function normalizeCast(value: unknown): CastMember[] {
  return parseArray<any>(value)
    .map((member) => ({
      id: toNumber(member?.id, 0),
      name: toStringValue(member?.name, "Unknown").trim() || "Unknown",
      character: toStringValue(member?.character, "").trim(),
      profileUrl: toOptionalString(member?.profileUrl ?? member?.profile_path),
    }))
    .filter((member) => member.id !== 0 || member.name !== "Unknown");
}

function normalizeMovie(movie: Partial<Movie> & Record<string, unknown>): Movie {
  const now = new Date().toISOString();
  return {
    id: toNumber(movie.id, Date.now()),
    tmdbId: movie.tmdbId === null || movie.tmdbId === undefined ? null : toNumber(movie.tmdbId, 0) || null,
    title: toStringValue(movie.title, "Untitled") || "Untitled",
    originalTitle: toStringValue(movie.originalTitle, "").trim() || toStringValue(movie.title, "Untitled") || "Untitled",
    year: toNumber(movie.year, new Date().getFullYear()),
    releaseDate: toStringValue(movie.releaseDate, now) || now,
    runtime: toNumber(movie.runtime, 0),
    genres: normalizeGenres(movie.genres),
    tmdbRating: toNumber(movie.tmdbRating, 0),
    personalRating: movie.personalRating === null || movie.personalRating === undefined ? null : toNumber(movie.personalRating, 0),
    status: (movie.status as Movie["status"]) || "wishlist",
    overview: toStringValue(movie.overview, ""),
    posterUrl: toStringValue(movie.posterUrl, ""),
    backdropUrl: toStringValue(movie.backdropUrl, ""),
    cast: normalizeCast(movie.cast),
    director: toStringValue(movie.director, "").trim() || "Unknown",
    production: toStringValue(movie.production, "").trim() || "Unknown",
    trailerUrl: toOptionalString(movie.trailerUrl),
    notes: toStringValue(movie.notes, ""),
    isFavorite: Boolean(movie.isFavorite),
    addedAt: toStringValue(movie.addedAt, now) || now,
    type: movie.type === "tv" ? "tv" : "movie",
  };
}

async function enrichWithTmdbDetails(movie: Partial<Movie>): Promise<Partial<Movie>> {
  if (!movie.tmdbId) return movie;

  try {
    const details = movie.type === "tv" ? await tmdbService.getTvDetails(movie.tmdbId) : await tmdbService.getMovieDetails(movie.tmdbId);
    if (!details) return movie;
    return {
      ...movie,
      ...tmdbService.buildMovieFieldsFromTmdb(details, movie.type === "tv" ? "tv" : "movie"),
      notes: movie.notes ?? "",
      status: movie.status ?? "wishlist",
      personalRating: movie.personalRating ?? null,
      isFavorite: movie.isFavorite ?? false,
    };
  } catch (error) {
    console.error("TMDB enrichment failed:", error);
    return movie;
  }
}

export async function getMovies(): Promise<Movie[]> {
  // Try Supabase first when configured
  if (hasSupabase && supabase) {
    try {
      const { data, error } = await supabase.from("movies").select("*").order("addedAt", { ascending: false });
      if (!error && Array.isArray(data)) {
        return data.map((movie) => normalizeMovie(movie));
      }
    } catch (e) {
      console.error("Supabase getMovies exception:", e);
      // fall back to in-memory
    }
  }

  await delay(600);
  return [...moviesData];
}

export async function getMovieById(id: number): Promise<Movie | undefined> {
  if (hasSupabase && supabase) {
    try {
      const { data, error } = await supabase.from("movies").select("*").eq("id", id).limit(1).single();
      if (!error && data) return normalizeMovie(data);
    } catch (e) {
      console.error("Supabase getMovieById exception:", e);
      // fallback
    }
  }

  await delay(400);
  return moviesData.find((m) => m.id === id);
}

export async function searchMoviesFromApi(query: string): Promise<SearchResult[]> {
  await delay(300);
  // If a TMDB API key is provided, prefer live search
  try {
    const resultsFromTmdb = await tmdbService.searchMovies(query);
    if (resultsFromTmdb && resultsFromTmdb.length > 0) return resultsFromTmdb;
  } catch (e) {
    // ignore and fallback to dummy
  }

  if (!query.trim()) return [];
  return dummySearchResults.filter((r) => r.title.toLowerCase().includes(query.toLowerCase())).map((r) => ({ ...r, type: r.type || "movie" }));
}

export async function addMovie(movie: Partial<Movie>): Promise<Movie> {
  const now = new Date().toISOString();
  const enrichedMovie = await enrichWithTmdbDetails(movie);
  const newMovie: Movie = {
    id: Date.now(),
    tmdbId: enrichedMovie.tmdbId ?? null,
    title: enrichedMovie.title || "Untitled",
    originalTitle: enrichedMovie.originalTitle || enrichedMovie.title || "Untitled",
    year: enrichedMovie.year || new Date().getFullYear(),
    releaseDate: enrichedMovie.releaseDate || now,
    runtime: enrichedMovie.runtime || 0,
    genres: enrichedMovie.genres || [],
    tmdbRating: enrichedMovie.tmdbRating || 0,
    personalRating: enrichedMovie.personalRating ?? null,
    status: enrichedMovie.status || "wishlist",
    overview: enrichedMovie.overview || "",
    posterUrl: enrichedMovie.posterUrl || "",
    backdropUrl: enrichedMovie.backdropUrl || "",
    cast: enrichedMovie.cast || [],
    director: enrichedMovie.director || "Unknown",
    production: enrichedMovie.production || "Unknown",
    trailerUrl: enrichedMovie.trailerUrl || null,
    notes: enrichedMovie.notes || "",
    isFavorite: enrichedMovie.isFavorite || false,
    addedAt: now,
    type: enrichedMovie.type || "movie",
  };

  if (hasSupabase && supabase) {
    try {
      const { data, error } = await supabase.from("movies").insert([newMovie]).select().single();
      if (!error && data) return normalizeMovie(data);
    } catch (e) {
      console.error("Supabase addMovie exception:", e);
      // fallback to in-memory
    }
  }

  await delay(300);
  moviesData = [newMovie, ...moviesData];
  return newMovie;
}

export async function updateMovie(id: number, updates: Partial<Movie>): Promise<Movie | undefined> {
  if (hasSupabase && supabase) {
    try {
      const { data, error } = await supabase.from("movies").update(updates).eq("id", id).select().single();
      if (!error && data) return data as Movie;
    } catch (e) {
      console.error("Supabase updateMovie exception:", e);
      // fallback
    }
  }

  await delay(300);
  const index = moviesData.findIndex((m) => m.id === id);
  if (index === -1) return undefined;
  moviesData[index] = normalizeMovie({ ...moviesData[index], ...updates });
  return moviesData[index];
}

export async function deleteMovie(id: number): Promise<boolean> {
  if (hasSupabase && supabase) {
    try {
      const { error } = await supabase.from("movies").delete().eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.error("Supabase deleteMovie exception:", e);
      // fallback
    }
  }

  await delay(300);
  const initialLength = moviesData.length;
  moviesData = moviesData.filter((m) => m.id !== id);
  return moviesData.length < initialLength;
}

export async function toggleFavorite(id: number): Promise<Movie | undefined> {
  // Try Supabase toggle
  if (hasSupabase && supabase) {
    try {
      // Fetch current value
      const { data, error } = await supabase.from("movies").select("isFavorite").eq("id", id).limit(1).single();
      if (!error && data) {
        const newVal = !data.isFavorite;
        const { data: updated, error: updateErr } = await supabase.from("movies").update({ isFavorite: newVal }).eq("id", id).select().single();
        if (!updateErr && updated) return normalizeMovie(updated);
      }
    } catch (e) {
      console.error("Supabase toggleFavorite exception:", e);
      // fallback
    }
  }

  await delay(200);
  const movie = moviesData.find((m) => m.id === id);
  if (!movie) return undefined;
  movie.isFavorite = !movie.isFavorite;
  return normalizeMovie({ ...movie });
}

export function calculateStats(moviesList: Movie[]): MovieStats {
  const completed = moviesList.filter((m) => m.status === "completed");
  const ratings = completed.map((m) => m.personalRating).filter((r): r is number => r !== null);

  // Count genre occurrences
  const genreCounts: Record<string, number> = {};
  moviesList.forEach((m) => {
    m.genres.forEach((g) => {
      if (!g?.name) return;
      genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
    });
  });
  const favoriteGenre = Object.entries(genreCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  return {
    totalMovies: moviesList.length,
    wishlist: moviesList.filter((m) => m.status === "wishlist").length,
    watching: moviesList.filter((m) => m.status === "watching").length,
    completed: completed.length,
    dropped: moviesList.filter((m) => m.status === "dropped").length,
    totalWatchHours: Math.round(completed.reduce((acc, m) => acc + toNumber(m.runtime, 0), 0) / 60),
    favoriteGenre,
    averageRating: ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : 0,
  };
}
