require('dotenv').config();
console.log('TMDB KEY:', process.env.TMDB_API_KEY);

const express = require('express');
const path = require('path');

const {
  searchMovies,
  searchTVShows,
  getSimilarMovies,
  getSimilarTVShowsFromMovie,
  getSimilarMoviesFromTV,
} = require('./utils/utils');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SEARCH ROUTE (FIXED)

app.get('/api/search', async (req, res) => {
  const { query, type } = req.query;

  if (!query || !type) {
    return res.status(400).json([]);
  }

  try {
    let results = [];

    if (type === 'movie') {
      results = await searchMovies(query);
    } else if (type === 'tv') {
      results = await searchTVShows(query);
    }

    res.json(results);
  } catch (err) {
    console.error('❌ SEARCH ERROR:', err.message);
    res.status(500).json([]);
  }
});

// DETAILS ROUTES
app.get('/movie/:id', async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.id}`,
      { params: { api_key: process.env.TMDB_API_KEY } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get('/tv/:id', async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${req.params.id}`,
      { params: { api_key: process.env.TMDB_API_KEY } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// SIMILAR ROUTES
app.get('/api/similar/:id', async (req, res) => {
  try {
    const results = await getSimilarMovies(req.params.id);
    res.json(results);
  } catch {
    res.json([]);
  }
});

app.get('/api/similar-tv/:id', async (req, res) => {
  try {
    const results = await getSimilarTVShowsFromMovie(req.params.id);
    res.json(results);
  } catch {
    res.json([]);
  }
});

app.get('/api/similar-movie-from-tv/:id', async (req, res) => {
  try {
    const results = await getSimilarMoviesFromTV(req.params.id);
    res.json(results);
  } catch {
    res.json([]);
  }
});

// START SERVER

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
