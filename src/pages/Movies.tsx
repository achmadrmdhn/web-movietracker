import { useState } from "react";
import { motion } from "framer-motion";
import { useMovies } from "@/hooks/useMovies";
import { useSearch } from "@/hooks/useSearch";
import { useFilter } from "@/hooks/useFilter";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import MovieCard from "@/components/MovieCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

const ITEMS_PER_PAGE = 12;

export default function Movies() {
  const { movies, loading } = useMovies();
  const { query, setQuery, filteredItems: searchResults } = useSearch(movies, ["title", "originalTitle"], "");
  const { statusFilter, setStatusFilter, genreFilter, setGenreFilter, typeFilter, setTypeFilter, sortBy, setSortBy, allGenres, filteredMovies } = useFilter(query ? searchResults : movies);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = filteredMovies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-text-primary">Movies</h1>
        <p className="mt-1 text-sm text-text-secondary">Browse and manage your movie collection</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-4">
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={(s) => {
            setStatusFilter(s);
            setCurrentPage(1);
          }}
          genreFilter={genreFilter}
          onGenreChange={(g) => {
            setGenreFilter(g);
            setCurrentPage(1);
          }}
          typeFilter={typeFilter}
          onTypeChange={(t) => {
            setTypeFilter(t);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={setSortBy}
          allGenres={allGenres}
          onReset={() => {
            setStatusFilter("all");
            setGenreFilter("all");
            setTypeFilter("all");
            setSortBy("addedAt");
            setCurrentPage(1);
          }}
        />
      </motion.div>

      {/* Results count */}
      <p className="text-sm text-text-muted">
        {filteredMovies.length} {filteredMovies.length === 1 ? "result" : "results"} found
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <LoadingSkeleton type="card" count={8} />
        </div>
      ) : paginatedMovies.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${page === currentPage ? "bg-primary text-white" : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </motion.div>
      )}
    </div>
  );
}
