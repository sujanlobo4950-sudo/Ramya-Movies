import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  key?: React.Key;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';

  return (
    <Link
      to={`/watch/${movie.media_type}/${movie.id}`}
      className="group relative bg-zinc-900 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10 shadow-lg"
    >
      <div className="aspect-[2/3] relative">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play className="text-white fill-current w-6 h-6 ml-1" />
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold text-yellow-500 border border-yellow-500/20">
          <Star className="w-3 h-3 fill-current" />
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-red-500 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
            {movie.media_type === 'movie' ? 'Movie' : 'TV Series'}
          </span>
          <span className="text-[10px] text-white/40 font-medium">{year}</span>
        </div>
      </div>
    </Link>
  );
}
