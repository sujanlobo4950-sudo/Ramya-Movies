import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(false);
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
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  React.useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);
        
        setError(null);
        try {
          const data = await searchMovies(query, page);
          if (data.length === 0) {
            setHasMore(false);
          } else {
            setResults(prev => page === 1 ? data : [...prev, ...data]);
          }
        } catch (err: any) {
          console.error('Error searching:', err);
          if (err.response?.status === 401) {
            setError('Invalid API Key. Please check your VITE_TMDB_API_KEY in the Secrets panel.');
          } else {
            setError('Search failed. Please try again later.');
          }
        } finally {
          setLoading(false);
          setLoadingMore(false);
        }
      };
      fetchResults();
    }
  }, [query, page]);

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
      <div className="flex items-center gap-3 mb-8">
        <SearchIcon className="text-red-600 w-8 h-8" />
        <h1 className="text-3xl font-bold text-white">
          Results for: <span className="text-red-600 italic">"{query}"</span>
        </h1>
      </div>

      {loading && page === 1 ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {results.map((movie, index) => (
              <div key={`${movie.id}-${index}`} ref={index === results.length - 1 ? lastElementRef : null}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          
          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/60 text-xl">No results found for your search.</p>
        </div>
      )}
    </div>
  );
}
