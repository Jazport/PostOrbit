require('dotenv').config();
const axios = require('axios');

const TMDB_BEARER = process.env.TMDB_BEARER;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_BEARER) {
  throw new Error('❌ TMDB_BEARER is missing from .env');
}

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_BEARER}`,
    'Content-Type': 'application/json;charset=utf-8'
  }
});

/* ===========================
   SEARCH
=========================== */

async function searchMovies(query) {
  if (!query) return [];
  try {
    const res = await tmdb.get('/search/movie', {
      params: { query }
    });
    return res.data.results;
  } catch (err) {
    console.error('❌ Movie search failed:', err.response?.data || err.message);
    return [];
  }
}

async function searchTVShows(query) {
  if (!query) return [];
  try {
    const res = await tmdb.get('/search/tv', {
      params: { query }
    });
    return res.data.results;
  } catch (err) {
    console.error('❌ TV search failed:', err.response?.data || err.message);
    return [];
  }
}

/* ===========================
   SIMILAR
=========================== */

async function getSimilarMovies(id) {
  try {
    const res = await tmdb.get(`/movie/${id}/similar`);
    return res.data.results;
  } catch {
    return [];
  }
}

async function getSimilarTVShowsFromMovie(id) {
  try {
    const movie = await tmdb.get(`/movie/${id}`);
    const genres = movie.data.genres.map(g => g.id).join(',');

    const res = await tmdb.get('/discover/tv', {
      params: { with_genres: genres }
    });

    return res.data.results.slice(0, 12);
  } catch {
    return [];
  }
}

async function getSimilarMoviesFromTV(id) {
  try {
    const tv = await tmdb.get(`/tv/${id}`);
    const genres = tv.data.genres.map(g => g.id).join(',');

    const res = await tmdb.get('/discover/movie', {
      params: { with_genres: genres }
    });

    return res.data.results.slice(0, 12);
  } catch {
    return [];
  }
}

module.exports = {
  searchMovies,
  searchTVShows,
  getSimilarMovies,
  getSimilarTVShowsFromMovie,
  getSimilarMoviesFromTV
};
