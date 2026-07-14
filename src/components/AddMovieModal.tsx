import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Plus, Loader2 } from "lucide-react";
import { searchMoviesFromApi } from "@/services/movieService";
import { buildCastList, buildMovieFieldsFromTmdb, getMovieDetails, getTvDetails } from "@/services/tmdbService";
import type { Movie, SearchResult } from "@/types/movie";

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (movie: Partial<Movie>) => void;
}

export default function AddMovieModal({ isOpen, onClose, onAdd }: AddMovieModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const data = await searchMoviesFromApi(value);
    setResults(data);
    setLoading(false);
  };

  const handleAdd = async (result: SearchResult) => {
    setAddingId(result.id);
    const details = result.type === "tv" ? await getTvDetails(result.id) : await getMovieDetails(result.id);
    const enriched = details ? buildMovieFieldsFromTmdb(details, result.type) : null;
    await onAdd({
      tmdbId: result.id,
      title: enriched?.title ?? result.title,
      originalTitle: enriched?.originalTitle ?? result.title,
      year: enriched?.year ?? result.year,
      releaseDate: enriched?.releaseDate ?? new Date().toISOString(),
      runtime: enriched?.runtime ?? 0,
      genres: enriched?.genres ?? [],
      tmdbRating: enriched?.tmdbRating ?? 0,
      personalRating: null,
      status: "wishlist",
      overview: enriched?.overview ?? result.overview,
      posterUrl: enriched?.posterUrl || result.posterUrl,
      backdropUrl: enriched?.backdropUrl || result.posterUrl,
      cast: enriched?.cast ?? buildCastList(details?.credits),
      director: enriched?.director ?? "Unknown",
      production: enriched?.production ?? "Unknown",
      trailerUrl: enriched?.trailerUrl ?? null,
      isFavorite: false,
      type: result.type,
    });
    setAddingId(null);
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-bg-card p-0 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-text-primary">Add Movie</h2>
              <button onClick={handleClose} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-border px-6 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for a movie..."
                  autoFocus
                  className="w-full rounded-lg border border-border bg-bg-elevated py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-4">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {!loading && results.length === 0 && query.length >= 2 && <p className="py-8 text-center text-sm text-text-muted">No movies found. Try a different search.</p>}

              {!loading && query.length < 2 && <p className="py-8 text-center text-sm text-text-muted">Type at least 2 characters to search.</p>}

              <div className="space-y-3">
                {results.map((result) => (
                  <motion.div key={result.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 rounded-lg border border-border p-3 transition-colors hover:border-border-hover hover:bg-bg-elevated">
                    <img src={result.posterUrl} alt={result.title} className="h-24 w-16 shrink-0 rounded-md object-cover" />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary">{result.title}</h4>
                        <p className="mt-0.5 text-xs text-text-muted">{result.year}</p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-wide text-text-muted">{result.type === "tv" ? "TV Series" : "Movie"}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{result.overview}</p>
                      </div>
                      <button
                        onClick={() => handleAdd(result)}
                        disabled={addingId === result.id}
                        className="mt-2 flex w-fit items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
                      >
                        {addingId === result.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        Add to Wishlist
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
