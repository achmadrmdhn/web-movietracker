import type { SearchResult } from "@/types/movie";

const TMDB_BASE = "https://api.themoviedb.org/3";

function imageUrl(path: string | null | undefined, size: "w185" | "w500" | "original" = "w500"): string {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}

function getKey(): string | null {
  // Vite exposes variables prefixed with VITE_
  return (import.meta as any).env?.VITE_TMDB_API_KEY || null;
}

export async function searchMovies(query: string): Promise<SearchResult[]> {
  const key = getKey();
  if (!key) return [];
  if (!query.trim()) return [];

  const [movieRes, tvRes] = await Promise.all([
    fetch(`${TMDB_BASE}/search/movie?api_key=${encodeURIComponent(key)}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`),
    fetch(`${TMDB_BASE}/search/tv?api_key=${encodeURIComponent(key)}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`),
  ]);

  const movieData = movieRes.ok ? await movieRes.json() : { results: [] };
  const tvData = tvRes.ok ? await tvRes.json() : { results: [] };

  const movies = Array.isArray(movieData.results)
    ? movieData.results.map(
        (r: any) =>
          ({
            id: r.id,
            title: r.title,
            year: r.release_date ? Number(r.release_date.slice(0, 4)) : 0,
            overview: r.overview || "",
            posterUrl: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : "",
            type: "movie",
          }) as SearchResult,
      )
    : [];

  const tvSeries = Array.isArray(tvData.results)
    ? tvData.results.map(
        (r: any) =>
          ({
            id: r.id,
            title: r.name,
            year: r.first_air_date ? Number(r.first_air_date.slice(0, 4)) : 0,
            overview: r.overview || "",
            posterUrl: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : "",
            type: "tv",
          }) as SearchResult,
      )
    : [];

  return [...movies, ...tvSeries].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.title.localeCompare(b.title);
  });
}

export async function getMovieDetails(tmdbId: number) {
  const key = getKey();
  if (!key) return null;
  const url = `${TMDB_BASE}/movie/${tmdbId}?api_key=${encodeURIComponent(key)}&append_to_response=credits,videos`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function getTvDetails(tmdbId: number) {
  const key = getKey();
  if (!key) return null;
  const url = `${TMDB_BASE}/tv/${tmdbId}?api_key=${encodeURIComponent(key)}&append_to_response=credits,videos`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export function buildTrailerUrl(videos: { results?: Array<{ site?: string; type?: string; official?: boolean; key?: string }> } | null | undefined): string | null {
  const results = videos?.results;
  if (!Array.isArray(results)) return null;

  const preferred = results.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official !== false && video.key);
  const fallback = results.find((video) => video.site === "YouTube" && video.key);
  const key = preferred?.key ?? fallback?.key ?? null;

  return key ? `https://www.youtube.com/watch?v=${key}` : null;
}

export function buildCastList(credits: { cast?: Array<{ id?: number; name?: string; character?: string; profile_path?: string | null }> } | null | undefined, limit = 6) {
  const cast = credits?.cast;
  if (!Array.isArray(cast)) return [];

  return cast.slice(0, limit).map((member) => ({
    id: member.id ?? 0,
    name: member.name ?? "Unknown",
    character: member.character ?? "",
    profileUrl: imageUrl(member.profile_path, "w185") || null,
  }));
}

export function buildProductionName(details: { production_companies?: Array<{ name?: string }>; networks?: Array<{ name?: string }> } | null | undefined): string {
  const companies = details?.production_companies;
  if (Array.isArray(companies) && companies.length > 0) {
    return companies
      .map((company) => company.name)
      .filter(Boolean)
      .join(", ");
  }

  const networks = details?.networks;
  if (Array.isArray(networks) && networks.length > 0) {
    return networks
      .map((network) => network.name)
      .filter(Boolean)
      .join(", ");
  }

  return "";
}

export function buildMovieFieldsFromTmdb(details: any, type: "movie" | "tv") {
  const title = type === "tv" ? (details?.name ?? "Untitled") : (details?.title ?? "Untitled");
  const originalTitle = type === "tv" ? (details?.original_name ?? title) : (details?.original_title ?? title);
  const releaseDate = type === "tv" ? (details?.first_air_date ?? "") : (details?.release_date ?? "");
  const year = releaseDate ? Number(releaseDate.slice(0, 4)) : new Date().getFullYear();
  const runtime = type === "tv" ? Number(Array.isArray(details?.episode_run_time) ? details.episode_run_time[0] || 0 : 0) : Number(details?.runtime || 0);
  const genreSource = Array.isArray(details?.genres) ? details.genres : [];
  const genres = genreSource.map((genre: any) => ({ id: Number(genre.id) || 0, name: genre.name || "Unknown" }));
  const cast = buildCastList(details?.credits);
  const director =
    type === "tv"
      ? Array.isArray(details?.created_by) && details.created_by.length > 0
        ? details.created_by
            .map((creator: { name?: string }) => creator.name)
            .filter(Boolean)
            .join(", ")
        : ""
      : Array.isArray(details?.credits?.crew)
        ? details.credits.crew
            .filter((crewMember: { job?: string }) => crewMember.job === "Director")
            .map((crewMember: { name?: string }) => crewMember.name)
            .filter(Boolean)
            .join(", ")
        : "";

  return {
    title,
    originalTitle,
    year,
    releaseDate,
    runtime,
    genres,
    tmdbRating: Number(details?.vote_average || 0),
    overview: details?.overview || "",
    posterUrl: imageUrl(details?.poster_path, "w500"),
    backdropUrl: imageUrl(details?.backdrop_path, "original"),
    cast,
    director,
    production: buildProductionName(details),
    trailerUrl: buildTrailerUrl(details?.videos),
    type,
    tmdbId: Number(details?.id || 0) || null,
  };
}

export default {
  searchMovies,
  getMovieDetails,
  getTvDetails,
};
