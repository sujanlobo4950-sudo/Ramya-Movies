import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY || process.env.TMDB_API_KEY || '9d8cf97474a82331932cdd34262788fc';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // TMDB Proxy API
  app.get('/api/tmdb/*', async (req, res) => {
    try {
      const endpoint = req.params[0];
      const queryParams = { ...req.query };
      
      // Use the hardcoded key or environment variable
      const currentKey = TMDB_API_KEY;

      if (!currentKey) {
        console.error('TMDB Proxy Error: API key is missing from environment variables.');
        return res.status(500).json({ 
          error: 'TMDB API key not configured on server. Please add VITE_TMDB_API_KEY to the Secrets panel.' 
        });
      }

      const isV4 = currentKey.length > 50;
      const config: any = {
        params: queryParams,
        headers: {}
      };

      if (isV4) {
        config.headers.Authorization = `Bearer ${currentKey}`;
        // Remove api_key from params if it was somehow passed from client
        delete config.params.api_key;
      } else {
        config.params.api_key = currentKey;
      }

      const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}`, config);
      res.json(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || { message: error.message };
      
      console.error(`TMDB Proxy Error [${status}]:`, JSON.stringify(errorData));
      
      if (status === 401) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'The TMDB API key provided is invalid. Please check your VITE_TMDB_API_KEY in the Secrets panel.',
          details: errorData
        });
      } else {
        res.status(status).json(errorData);
      }
    }
  });

  // Custom API endpoint example
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Custom API is running' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
