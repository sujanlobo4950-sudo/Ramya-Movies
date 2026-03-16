export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime?: number;
  number_of_seasons?: number;
  tagline?: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviders {
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: WatchProvider[];
      buy?: WatchProvider[];
      rent?: WatchProvider[];
    };
  };
}

export interface MovieImage {
  file_path: string;
  aspect_ratio: number;
}

export interface MovieImages {
  backdrops: MovieImage[];
  posters: MovieImage[];
}
