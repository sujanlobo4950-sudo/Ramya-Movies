import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TvShows from './pages/TvShows';
import IndianMovies from './pages/IndianMovies';
import Search from './pages/Search';
import Watch from './pages/Watch';
import { Film, Github, Twitter, Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <Film className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase italic">
              Ramya<span className="text-red-600">Movies</span>
            </span>
          </div>
          <p className="text-white/40 text-sm max-w-xs text-center md:text-left">
            The ultimate destination for premium movie and TV show streaming. Cinematic experience at your fingertips.
          </p>
        </div>

        <div className="flex gap-6">
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>

        <div className="text-white/40 text-xs text-center md:text-right">
          <p>&copy; {new Date().getFullYear()} Ramya Movies. All rights reserved.</p>
          <p className="mt-1">Powered by TMDB & AutoEmbed</p>
        </div>
      </div>
    </footer>
  );
}

function ApiKeyWarning() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-red-600/20 rounded-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto">
          <Film className="text-red-600 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">TMDB API Key Required</h1>
        <p className="text-white/60">
          To display movies and TV shows, you need a TMDB API key. 
          Please add <code className="bg-black px-2 py-1 rounded text-red-500">VITE_TMDB_API_KEY</code> to your environment variables.
        </p>
        <a 
          href="https://www.themoviedb.org/settings/api" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Get API Key
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const hasApiKey = !!(import.meta as any).env.VITE_TMDB_API_KEY;

  if (!hasApiKey) {
    return <ApiKeyWarning />;
  }

  return (
    <Router>
      <div className="bg-zinc-950 min-h-screen font-sans selection:bg-red-600 selection:text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watch/:type/:id" element={<Watch />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/indian" element={<IndianMovies />} />
            <Route path="/tv" element={<TvShows />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
