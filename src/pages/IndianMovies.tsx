import React from 'react';
import { getIndianMovies } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { Languages, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LANGUAGES = [
  { code: '', name: 'All Languages' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'bn', name: 'Bengali' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
];

export default function IndianMovies() {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [selectedLang, setSelectedLang] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await getIndianMovies(selectedLang || undefined);
        setMovies(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching Indian movies:', err);
        setError('Failed to load Indian movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedLang]);

  return (
    <div className="bg-zinc-950 min-h-screen pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600">
                <Languages size={20} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Indian Cinema</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                Indian <span className="text-red-600">Movies</span>
              </h1>
              <p className="text-white/40 max-w-xl text-sm md:text-base">
                Explore the vibrant world of Indian cinema across multiple languages. From Bollywood to regional masterpieces.
              </p>
            </div>
          </div>

          {/* Language Filter */}
          <div className="flex flex-wrap gap-2 pt-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                  selectedLang === lang.code
                    ? 'bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-105'
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </header>

        {error ? (
          <div className="bg-red-600/10 border border-red-600/20 p-8 rounded-2xl text-center space-y-4">
            <p className="text-red-500 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedLang}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <Filter className="mx-auto text-white/20 w-12 h-12" />
                  <p className="text-white/40 font-medium">No movies found for this language.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
