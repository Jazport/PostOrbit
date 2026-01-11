console.log('✅ script.js loaded');

const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const moviesContainer = document.getElementById('movies-container');
const loadingScreen = document.getElementById('loading-screen');
const modal = document.getElementById('movie-modal');
const detailsContainer = document.getElementById('movie-details');

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const MIN_LOADER_TIME = 800;
let loaderStartTime = 0;

/* ENTER KEY */
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchBtn.click();
});

/* SEARCH */
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  moviesContainer.innerHTML = '';
  showLoader();

  try {
    const [movieRes, tvRes] = await Promise.all([
      fetch(`/api/search?query=${encodeURIComponent(query)}&type=movie`),
      fetch(`/api/search?query=${encodeURIComponent(query)}&type=tv`)
    ]);

    const movies = movieRes.ok ? await movieRes.json() : [];
    const tvShows = tvRes.ok ? await tvRes.json() : [];

    hideLoader();
    displayResults([...movies, ...tvShows]);
  } catch (err) {
    console.error(err);
    hideLoader();
    moviesContainer.innerHTML = `<p style="text-align:center;">Error loading content.</p>`;
  }
});

/* DISPLAY RESULTS */
function displayResults(items) {
  moviesContainer.innerHTML = '';
  if (!items.length) {
    moviesContainer.innerHTML = `<p style="text-align:center;">No results found.</p>`;
    return;
  }

  items.forEach(item => {
    const isTV = !!item.name;
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = item.id;
    card.dataset.type = isTV ? 'tv' : 'movie';

    card.innerHTML = `
      <img src="${item.poster_path ? IMAGE_BASE + item.poster_path : 'https://via.placeholder.com/180x270?text=No+Image'}">
      <div class="movie-info">
        <h3>${item.title || item.name}</h3>
        <p>⭐ ${item.vote_average || 'N/A'}</p>
        <p>${item.release_date || item.first_air_date || 'N/A'}</p>
      </div>
    `;
    moviesContainer.appendChild(card);
  });
}

/* CLICK CARD / SIMILAR */
document.addEventListener('click', async e => {
  const target = e.target.closest('.movie-card') || e.target.closest('.similar-grid img');
  if (!target) return;

  const id = target.dataset.id;
  const type = target.dataset.type;
  if (!id || !type) return;

  showLoader();

  try {
    let detailsRes, similarMoviesRes, similarTVRes;

    if (type === 'movie') {
      [detailsRes, similarMoviesRes, similarTVRes] = await Promise.all([
        fetch(`/movie/${id}`),
        fetch(`/api/similar/${id}`),
        fetch(`/api/similar-tv/${id}`)
      ]);
    } else {
      [detailsRes, similarTVRes, similarMoviesRes] = await Promise.all([
        fetch(`/tv/${id}`),
        fetch(`/api/similar-tv/${id}`),
        fetch(`/api/similar-movie-from-tv/${id}`)
      ]);
    }

    const details = await detailsRes.json();
    const similarMovies = similarMoviesRes.ok ? await similarMoviesRes.json() : [];
    const similarTV = similarTVRes.ok ? await similarTVRes.json() : [];

    hideLoader();
    renderModal(details, similarMovies, similarTV);
    modal.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    hideLoader();
    detailsContainer.innerHTML = `<p style="text-align:center; color:red;">Failed to load details.</p>`;
    modal.classList.remove('hidden');
  }
});

/* RENDER MODAL */
function renderModal(details, movies, tv) {
  detailsContainer.innerHTML = `
    <div class="details-layout">
      <div class="main-info">
        <img src="${details.poster_path ? IMAGE_BASE + details.poster_path : 'https://via.placeholder.com/200x300?text=No+Image'}">
        <div>
          <h2>${details.title || details.name}</h2>
          <p>⭐ ${details.vote_average || 'N/A'}</p>
          <p>${details.release_date || details.first_air_date || ''}</p>
          <p>${details.overview || 'No overview available.'}</p>
        </div>
      </div>
      ${movies.length ? buildSimilar('Similar Movies', movies, 'movie') : ''}
      ${tv.length ? buildSimilar('Similar TV Shows', tv, 'tv') : ''}
    </div>
  `;
}

/* SIMILAR CARDS */
function buildSimilar(title, items, type) {
  return `
    <h3>${title}</h3>
    <div class="similar-wrapper">
      <button class="scroll-btn left" data-target="${type}">‹</button>
      <div class="similar-grid" data-list="${type}">
        ${items.map(i => `
          <img src="${i.poster_path ? IMAGE_BASE + i.poster_path : ''}" data-id="${i.id}" data-type="${type}" title="${i.title || i.name}">
        `).join('')}
      </div>
      <button class="scroll-btn right" data-target="${type}">›</button>
    </div>
  `;
}

/* SCROLL BUTTONS */
document.addEventListener('click', e => {
  const btn = e.target.closest('.scroll-btn');
  if (!btn) return;

  const dir = btn.classList.contains('left') ? -1 : 1;
  const grid = document.querySelector(`.similar-grid[data-list="${btn.dataset.target}"]`);
  if (!grid) return;

  grid.scrollBy({ left: 300 * dir, behavior: 'smooth' });
});

/* CLOSE MODAL */
document.addEventListener('click', e => {
  if (e.target.classList.contains('close')) modal.classList.add('hidden');
});

/* LOADER */
function showLoader() {
  loaderStartTime = Date.now();
  loadingScreen.classList.remove('hidden');
}

function hideLoader() {
  const elapsed = Date.now() - loaderStartTime;
  setTimeout(() => loadingScreen.classList.add('hidden'), Math.max(0, MIN_LOADER_TIME - elapsed));
}
