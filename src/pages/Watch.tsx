import React from 'react';
import { useParams } from 'react-router-dom';
import { getDetails, getRecommendations, getImageUrl } from '../services/tmdb';
import { Movie, MovieDetails } from '../types';
import MovieCard from '../components/MovieCard';
import { Star, Calendar, Clock, Play, List } from 'lucide-react';

export default function Watch() {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const [details, setDetails] = React.useState<MovieDetails | null>(null);
  const [recommendations, setRecommendations] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [season, setSeason] = React.useState(1);
  const [episode, setEpisode] = React.useState(1);
  const [activeServer, setActiveServer] = React.useState('autoembed');

  const servers = [
    { id: 'autoembed', name: 'Server 1 (AutoEmbed)', url: type === 'movie' ? `https://player.autoembed.cc/movie/${id}` : `https://player.autoembed.cc/tv/${id}/${season}/${episode}` },
    { id: 'vidsrc', name: 'Server 2 (VidSrc)', url: type === 'movie' ? `https://vidsrc.me/embed/movie?tmdb=${id}` : `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${season}&epi=${episode}` },
    { id: 'vidsrc_to', name: 'Server 3 (VidSrc.to)', url: type === 'movie' ? `https://vidsrc.to/embed/movie/${id}` : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` },
  ];

  const currentServer = servers.find(s => s.id === activeServer) || servers[0];

  React.useEffect(() => {
    if (id && type) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [detailsData, recData] = await Promise.all([
            getDetails(id, type),
            getRecommendations(id, type),
          ]);
          setDetails(detailsData);
          setRecommendations(recData);
        } catch (error) {
          console.error('Error fetching details:', error);
        } finally {
          setLoading(false);
          window.scrollTo(0, 0);
        }
      };
      fetchData();
    }
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-20">
      {/* Player Section */}
      <div className="w-full aspect-video bg-black relative shadow-2xl">
        <iframe
          src={currentServer.url}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          frameBorder="0"
          title="Movie Player"
        />
      </div>

      <div className="px-6 md:px-12 mt-4 flex flex-wrap gap-2 items-center">
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest mr-2">Switch Server:</span>
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setActiveServer(server.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeServer === server.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {server.name}
          </button>
        ))}
        <p className="text-[10px] text-white/30 italic ml-auto hidden md:block">
          Tip: If one server doesn't work, try switching to another.
        </p>
      </div>

      <div className="px-6 md:px-12 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              {details.title || details.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                {details.vote_average.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <Calendar className="w-4 h-4" />
                {new Date(details.release_date || details.first_air_date || '').getFullYear()}
              </div>
              {details.runtime && (
                <div className="flex items-center gap-1 text-white/60">
                  <Clock className="w-4 h-4" />
                  {details.runtime} min
                </div>
              )}
              <div className="flex gap-2">
                {details.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-white/80 uppercase tracking-wider"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            {details.tagline && (
              <p className="text-red-500 italic font-medium text-lg">"{details.tagline}"</p>
            )}
            <p className="text-white/70 text-lg leading-relaxed">{details.overview}</p>
          </div>

          {type === 'tv' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 text-white font-bold text-xl">
                <List className="text-red-600" />
                Episode Selector
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase font-black tracking-widest">Season</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(Number(e.target.value))}
                    className="bg-zinc-900 border border-white/10 text-white rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {Array.from({ length: details.number_of_seasons || 1 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase font-black tracking-widest">Episode</label>
                  <input
                    type="number"
                    min="1"
                    value={episode}
                    onChange={(e) => setEpisode(Number(e.target.value))}
                    className="bg-zinc-900 border border-white/10 text-white rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>
          )}

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Play className="text-red-600 w-5 h-5 fill-current" />
              Recommended for You
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {recommendations.slice(0, 8).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10">
            <img
              src={getImageUrl(details.poster_path, 'original')}
              alt={details.title || details.name}
              className="w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl">Quick Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">Status</span>
                <span className="text-white">{(details as any).status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">Original Language</span>
                <span className="text-white uppercase">{(details as any).original_language}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">Budget</span>
                <span className="text-white">
                  {(details as any).budget ? `$${((details as any).budget / 1000000).toFixed(1)}M` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">Revenue</span>
                <span className="text-white">
                  {(details as any).revenue ? `$${((details as any).revenue / 1000000).toFixed(1)}M` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
