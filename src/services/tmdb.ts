import axios from 'axios';
import { Movie, MovieDetails, Genre } from '../types';

// Now calling our own local API instead of TMDB directly
const BASE_URL = '/api/tmdb';

const tmdb = axios.create({
  baseURL: BASE_URL,
});

export const getTrending = async (type: 'all' | 'movie' | 'tv' = 'all'): Promise<Movie[]> => {
  const { data } = await tmdb.get(`/trending/${type}/day`);
  return data.results;
};

export const getPopular = async (type: 'movie' | 'tv' = 'movie', page: number = 1): Promise<Movie[]> => {
  const { data } = await tmdb.get(`/${type}/popular`, {
    params: { page }
  });
  return data.results.map((item: any) => ({ ...item, media_type: type }));
};

export const searchMovies = async (query: string, page: number = 1): Promise<Movie[]> => {
  const { data } = await tmdb.get('/search/multi', {
    params: { query, page },
  });
  return data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
};

export const getDetails = async (id: string, type: 'movie' | 'tv'): Promise<MovieDetails> => {
  const { data } = await tmdb.get(`/${type}/${id}`);
  return { ...data, media_type: type };
};

export const getRecommendations = async (id: string, type: 'movie' | 'tv'): Promise<Movie[]> => {
  const { data } = await tmdb.get(`/${type}/${id}/recommendations`);
  return data.results.map((item: any) => ({ ...item, media_type: type }));
};

export const getTopRated = async (type: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
  const { data } = await tmdb.get(`/${type}/top_rated`);
  return data.results.map((item: any) => ({ ...item, media_type: type }));
};

export const getUpcoming = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get('/movie/upcoming');
  return data.results.map((item: any) => ({ ...item, media_type: 'movie' }));
};

export const getGenres = async (type: 'movie' | 'tv'): Promise<Genre[]> => {
  const { data } = await tmdb.get(`/genre/${type}/list`);
  return data.genres;
};

export const discover = async (type: 'movie' | 'tv', genreId?: string, page: number = 1): Promise<Movie[]> => {
  const { data } = await tmdb.get(`/discover/${type}`, {
    params: { with_genres: genreId, page },
  });
  return data.results.map((item: any) => ({ ...item, media_type: type }));
};

export const getIndianMovies = async (language?: string, page: number = 1): Promise<Movie[]> => {
  const { data } = await tmdb.get('/discover/movie', {
    params: {
      with_origin_country: 'IN',
      with_original_language: language,
      page,
      sort_by: 'popularity.desc',
    },
  });
  return data.results.map((item: any) => ({ ...item, media_type: 'movie' }));
};

export const getImageUrl = (path: string, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
