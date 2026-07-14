import type { MovieStatus, SortOption } from "@/types/movie";

interface FilterBarProps {
  statusFilter: MovieStatus | "all";
  onStatusChange: (status: MovieStatus | "all") => void;
  genreFilter: string;
  onGenreChange: (genre: string) => void;
  typeFilter: "all" | "movie" | "tv";
  onTypeChange: (type: "all" | "movie" | "tv") => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  allGenres: string[];
  onReset?: () => void;
}

export default function FilterBar({ statusFilter, onStatusChange, genreFilter, onGenreChange, typeFilter, onTypeChange, sortBy, onSortChange, allGenres, onReset }: FilterBarProps) {
  const selectClasses =
    "rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary shadow-sm transition-all duration-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer min-w-[10rem] sm:min-w-[12rem]";

  return (
    <div className="glass rounded-xl p-3 flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value as MovieStatus | "all")} className={selectClasses} style={{ colorScheme: "dark" }}>
        <option value="all">All Status</option>
        <option value="wishlist">Wishlist</option>
        <option value="watching">Watching</option>
        <option value="completed">Completed</option>
        <option value="dropped">Dropped</option>
      </select>

      {/* Genre Filter */}
      <select value={genreFilter} onChange={(e) => onGenreChange(e.target.value)} className={selectClasses} style={{ colorScheme: "dark" }}>
        <option value="all">All Genres</option>
        {allGenres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      {/* Type Filter */}
      <select value={typeFilter} onChange={(e) => onTypeChange(e.target.value as "all" | "movie" | "tv")} className={selectClasses} style={{ colorScheme: "dark" }}>
        <option value="all">All Types</option>
        <option value="movie">Movies</option>
        <option value="tv">TV Series</option>
      </select>

      {/* Sort By */}
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value as SortOption)} className={selectClasses} style={{ colorScheme: "dark" }}>
        <option value="addedAt">Recently Added</option>
        <option value="title">Title</option>
        <option value="year">Year</option>
        <option value="rating">Rating</option>
      </select>

      {/* Reset */}
      {onReset && (
        <button onClick={onReset} className="ml-auto rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-secondary hover:text-text-primary" type="button">
          Reset
        </button>
      )}
    </div>
  );
}
