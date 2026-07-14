import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Play, Clock, Calendar, Star, Trash2, PencilLine, RotateCcw, Save } from "lucide-react";
import type { Movie, MovieStatus } from "@/types/movie";
import { getMovieById } from "@/services/movieService";
import StatusBadge from "@/components/StatusBadge";
import GenreBadge from "@/components/GenreBadge";
import Rating from "@/components/Rating";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { formatRuntime, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useMovies } from "@/hooks/useMovies";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateMovie, deleteMovie, toggleFavorite } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      if (!id) return;
      setLoading(true);
      const data = await getMovieById(Number(id));
      setMovie(data || null);
      setNotesDraft(data?.notes || "");
      setIsEditingNotes(!(data?.notes || "").trim());
      setLoading(false);
    }
    fetchMovie();
  }, [id]);

  const handleStatusChange = async (status: MovieStatus) => {
    if (!movie) return;
    const updated = await updateMovie(movie.id, { status });
    if (updated) {
      setMovie(updated);
      toast.success(`Status updated to ${status}`);
    }
  };

  const handleRatingChange = async (rating: number) => {
    if (!movie) return;
    const updated = await updateMovie(movie.id, { personalRating: rating });
    if (updated) {
      setMovie(updated);
      toast.success("Rating updated");
    }
  };

  const handleToggleFavorite = async () => {
    if (!movie) return;
    const updated = await toggleFavorite(movie.id);
    if (updated) {
      setMovie(updated);
      toast.success(updated.isFavorite ? "Added to favorites" : "Removed from favorites");
    }
  };

  const handleDelete = async () => {
    if (!movie) return;
    const success = await deleteMovie(movie.id);
    if (success) {
      setMovie(null);
      toast.success("Movie deleted");
      navigate("/movies");
    }
  };

  const handleSaveNotes = async () => {
    if (!movie) return;
    const nextNotes = notesDraft.trim();
    const updated = await updateMovie(movie.id, { notes: nextNotes });
    if (updated) {
      setMovie(updated);
      setNotesDraft(updated.notes || "");
      setIsEditingNotes(!updated.notes.trim());
      toast.success(updated.notes.trim() ? "Notes updated" : "Notes cleared");
    }
  };

  const handleStartEditNotes = () => {
    if (!movie) return;
    setNotesDraft(movie.notes || "");
    setIsEditingNotes(true);
  };

  const handleResetNotes = () => {
    if (!movie) return;
    void (async () => {
      const updated = await updateMovie(movie.id, { notes: "" });
      if (updated) {
        setMovie(updated);
        setNotesDraft("");
        setIsEditingNotes(true);
        toast.success("Notes deleted");
      }
    })();
  };

  if (loading) {
    return <LoadingSkeleton type="detail" />;
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-text-primary">Movie not found</h2>
        <button onClick={() => navigate("/movies")} className="mt-4 text-primary hover:text-primary-hover">
          Back to movies
        </button>
      </div>
    );
  }

  const hasNotes = movie.notes.trim().length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Hero Backdrop */}
      <div className="relative -mx-4 -mt-2 overflow-hidden rounded-2xl sm:-mx-6 lg:-mx-8">
        <div className="aspect-[21/9] w-full">
          <img src={movie.backdropUrl || movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
        </div>
        <div className="gradient-overlay absolute inset-0" />
        <div className="gradient-overlay-right absolute inset-0" />

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            {/* Poster */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="hidden shrink-0 sm:block">
              <img src={movie.posterUrl} alt={movie.title} className="h-56 w-40 rounded-xl object-cover shadow-2xl ring-1 ring-white/10 lg:h-72 lg:w-48" />
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex-1">
              <h1 className="text-3xl font-bold text-text-primary lg:text-4xl">{movie.title}</h1>
              {movie.originalTitle !== movie.title && <p className="mt-1 text-sm text-text-muted italic">{movie.originalTitle}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(movie.releaseDate)}
                </span>
                <span className="text-text-muted">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="text-text-muted">·</span>
                <Rating value={movie.tmdbRating} size="md" />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <GenreBadge key={genre.id} name={genre.name} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="flex flex-wrap items-center gap-3">
        <StatusBadge status={movie.status} size="md" />

        {/* Status Dropdown */}
        <select
          value={movie.status}
          onChange={(e) => handleStatusChange(e.target.value as MovieStatus)}
          className="rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary shadow-sm transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          style={{ colorScheme: "dark" }}
        >
          <option value="wishlist">Wishlist</option>
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
        </select>

        {/* Favorite */}
        <button
          onClick={handleToggleFavorite}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
            movie.isFavorite ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-text-secondary hover:border-border-hover hover:text-text-primary"
          }`}
        >
          <Heart className={`h-4 w-4 ${movie.isFavorite ? "fill-primary" : ""}`} />
          {movie.isFavorite ? "Favorited" : "Favorite"}
        </button>

        {/* Trailer */}
        {movie.trailerUrl && (
          <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
            <Play className="h-4 w-4" />
            Watch Trailer
          </a>
        )}

        {/* Personal Rating */}
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
          <Star className="h-4 w-4 text-primary" />
          <select value={movie.personalRating ?? ""} onChange={(e) => handleRatingChange(Number(e.target.value))} className="bg-bg-card text-sm text-text-primary shadow-sm focus:outline-none" style={{ colorScheme: "dark" }}>
            <option value="">Rate</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => (
              <option key={r} value={r} className="bg-bg-card text-text-primary">
                {r}/10
              </option>
            ))}
          </select>
        </div>

        {/* Delete */}
        <button onClick={() => setShowDeleteDialog(true)} className="flex items-center gap-2 rounded-lg border border-danger/30 px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10">
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </motion.div>

      {/* Overview */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Overview</h2>
        <p className="leading-relaxed text-text-secondary">{movie.overview}</p>
      </motion.section>

      {/* Details Grid */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Cast */}
        <section className="glass rounded-xl p-5">
          <h3 className="mb-4 text-base font-semibold text-text-primary">Cast</h3>
          <div className="space-y-3">
            {movie.cast.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-bg-elevated">
                  {member.profileUrl ? (
                    <img src={member.profileUrl} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-medium text-text-muted">{member.name.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{member.name}</p>
                  <p className="text-xs text-text-muted">{member.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Production Info */}
        <section className="glass rounded-xl p-5">
          <h3 className="mb-4 text-base font-semibold text-text-primary">Production</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Director</p>
              <p className="mt-1 text-sm text-text-primary">{movie.director}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Production Company</p>
              <p className="mt-1 text-sm text-text-primary">{movie.production}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Type</p>
              <p className="mt-1 text-sm capitalize text-text-primary">{movie.type === "tv" ? "TV Series" : "Movie"}</p>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Notes */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }} className="glass rounded-xl p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-text-primary">Personal Notes</h3>
          <div className="flex items-center gap-2">
            {!isEditingNotes && hasNotes ? (
              <button onClick={handleStartEditNotes} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-hover hover:bg-bg-elevated">
                <PencilLine className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <button onClick={handleSaveNotes} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
                <Save className="h-4 w-4" />
                Save Notes
              </button>
            )}
            {hasNotes && (
              <button
                onClick={handleResetNotes}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:bg-bg-elevated hover:text-text-primary"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}
          </div>
        </div>
        <textarea
          value={notesDraft}
          onChange={(e) => {
            if (hasNotes && !isEditingNotes) return;
            setNotesDraft(e.target.value);
          }}
          placeholder="Tambahkan catatan pribadi tentang film ini..."
          rows={5}
          readOnly={hasNotes && !isEditingNotes}
          className={`mt-3 w-full resize-y rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 ${hasNotes && !isEditingNotes ? "cursor-default" : ""}`}
        />
      </motion.section>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteDialog(false)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-bg-card p-6 shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-text-primary">Delete Movie</h3>
              <p className="mt-2 text-sm text-text-secondary">Are you sure you want to delete "{movie.title}"? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowDeleteDialog(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary">
                  Cancel
                </button>
                <button onClick={handleDelete} className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger/90">
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
