import React from 'react';
import { getPopular, getGenres, discover } from '../services/tmdb';
import { Movie, Genre } from '../types';
import MovieCard from '../components/MovieCard';
import { Film, Filter, Loader2 } from 'lucide-react';

export default function Movies() {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const observer = React.useRef<IntersectionObserver | null>(null);
  const lastElementRef = React.useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  React.useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres('movie');
        setGenres(genreData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  React.useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [selectedGenre]);

  React.useEffect(() => {
    const fetchMovies = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      
      setError(null);
      try {
        const data = selectedGenre 
          ? await discover('movie', selectedGenre, page)
          : await getPopular('movie', page);
        
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setMovies(prev => page === 1 ? data : [...prev, ...data]);
        }
      } catch (err: any) {
        console.error('Error fetching movies:', err);
        if (err.response?.status === 401) {
          setError('Invalid API Key. Please check your VITE_TMDB_API_KEY in the Secrets panel.');
        } else {
          setError('Failed to load movies. Please try again later.');
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchMovies();
  }, [selectedGenre, page]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Configuration Required</h2>
          <p className="text-white/60">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all uppercase tracking-widest text-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 px-6 md:px-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-3">
          <Film className="text-red-600 w-8 h-8" />
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Explore Movies</h1>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full shrink-0">
            <Filter className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Filter</span>
          </div>
          <button
            onClick={() => setSelectedGenre('')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${
              selectedGenre === '' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id.toString())}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${
                selectedGenre === genre.id.toString() ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {loading && page === 1 ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie, index) => (
              <div key={`${movie.id}-${index}`} ref={index === movies.length - 1 ? lastElementRef : null}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          
          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
          )}
          
          {!hasMore && movies.length > 0 && (
            <p className="text-center text-white/20 text-sm uppercase font-black tracking-widest">
              You've reached the end of the cinematic universe
            </p>
          )}
        </div>
      )}
    </div>
  );
}
