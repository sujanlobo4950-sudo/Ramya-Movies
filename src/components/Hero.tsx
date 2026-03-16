import { Play, Info, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';

interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  const year = date ? new Date(date).getFullYear() : '';

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-center px-6 md:px-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-left-4 duration-700">
          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
            Trending Now
          </span>
          <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
            <Star className="w-4 h-4 fill-current" />
            {movie.vote_average.toFixed(1)}
          </div>
          <span className="text-white/60 text-sm font-medium">{year}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
          {title}
        </h1>

        <p className="text-lg text-white/70 mb-8 line-clamp-3 max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
          {movie.overview}
        </p>

        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-10 duration-700 delay-300">
          <Link
            to={`/watch/${movie.media_type}/${movie.id}`}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="fill-current w-5 h-5" />
            Watch Now
          </Link>
          <Link
            to={`/watch/${movie.media_type}/${movie.id}`}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10"
          >
            <Info className="w-5 h-5" />
            More Info
          </Link>
        </div>
      </div>
    </div>
  );
}
