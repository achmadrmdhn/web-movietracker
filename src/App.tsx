import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Movies from "@/pages/Movies";
import MovieDetail from "@/pages/MovieDetail";
import Favorites from "@/pages/Favorites";
import Statistics from "@/pages/Statistics";
import About from "@/pages/Settings";
import FloatingActionButton from "@/components/FloatingActionButton";
import AddMovieModal from "@/components/AddMovieModal";
import { MoviesProvider, useMovies } from "@/context/MoviesContext";
import type { Movie } from "@/types/movie";
import { toast } from "sonner";

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addMovie } = useMovies();

  const handleAddMovie = async (movie: Partial<Movie>) => {
    try {
      await addMovie(movie);
      toast.success("Movie added to wishlist!");
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to add movie");
    }
  };

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
      <FloatingActionButton onClick={() => setIsModalOpen(true)} />
      <AddMovieModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddMovie} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MoviesProvider>
        <AppContent />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1E1E1E",
              border: "1px solid #2A2A2A",
              color: "#FFFFFF",
              fontSize: "14px",
            },
          }}
          theme="dark"
        />
      </MoviesProvider>
    </BrowserRouter>
  );
}
