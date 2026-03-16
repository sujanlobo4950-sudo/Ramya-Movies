import React from 'react';
import { getTrending, getPopular, getTopRated, getUpcoming } from '../services/tmdb';
import { Movie } from '../types';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import { Film, Tv, TrendingUp, Star, Calendar } from 'lucide-react';

export default function Home() {
  const [trending, setTrending] = React.useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = React.useState<Movie[]>([]);
  const [popularTv, setPopularTv] = React.useState<Movie[]>([]);
  const [topRated, setTopRated] = React.useState<Movie[]>([]);
  const [upcoming, setUpcoming] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, moviesData, tvData, topRatedData, upcomingData] = await Promise.all([
          getTrending(),
          getPopular('movie'),
          getPopular('tv'),
          getTopRated('movie'),
          getUpcoming(),
        ]);
        setTrending(trendingData);
        setPopularMovies(moviesData);
        setPopularTv(tvData);
        setTopRated(topRatedData);
        setUpcoming(upcomingData);
      } catch (err: any) {
        console.error('Error fetching home data:', err);
        if (err.response?.status === 401) {
          setError('Invalid API Key. Please check your VITE_TMDB_API_KEY in the Secrets panel.');
        } else {
          setError('Failed to load movie data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto">
            <Film className="text-red-600 w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">API Configuration Required</h2>
            <p className="text-white/60 leading-relaxed">
              To display movies and TV shows, you need to provide a TMDB API key in the <strong>Secrets</strong> panel.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-left space-y-3">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">How to fix:</p>
            <ol className="text-sm text-white/70 space-y-2 list-decimal list-inside">
              <li>Get a key at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">themoviedb.org</a></li>
              <li>Open <strong>Settings &gt; Secrets</strong> in AI Studio</li>
              <li>Add <code>VITE_TMDB_API_KEY</code> as the key</li>
              <li>Paste your API key as the value</li>
            </ol>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-sm"
          >
            I've added the key, refresh now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen pb-20">
      {trending[0] && <Hero movie={trending[0]} />}

      <div className="px-6 md:px-12 -mt-20 relative z-10 space-y-16">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-red-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Trending Today</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trending.slice(1, 13).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-red-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Upcoming Releases</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {upcoming.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-red-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Top Rated Movies</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {topRated.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Film className="text-red-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Popular Movies</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {popularMovies.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Tv className="text-red-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Popular TV Shows</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {popularTv.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
