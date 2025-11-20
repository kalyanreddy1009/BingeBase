// BingeBase v2.0 IMAX Edition - Bug-Free JavaScript
// Configuration
const CONFIG = {
    API_KEY: localStorage.getItem('tmdb_api_key') || '',
    OMDB_KEY: localStorage.getItem('omdb_api_key') || '',
    API_BASE: 'https://api.themoviedb.org/3',
    OMDB_BASE: 'https://www.omdbapi.com',
    IMAGE_BASE: 'https://image.tmdb.org/t/p',
    POSTER: 'w500',
    BACKDROP: 'original'
};

// State Management
const state = {
    currentTab: 'home',
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    searchHistory: JSON.parse(localStorage.getItem('search_history')) || [],
    imdbCache: JSON.parse(localStorage.getItem('imdb_cache')) || {}
};

// DOM Elements
const el = {
    setupPage: document.getElementById('setupPage'),
    tmdbKey: document.getElementById('tmdbKey'),
    omdbKey: document.getElementById('omdbKey'),
    setupBtn: document.getElementById('setupBtn'),
    setupError: document.getElementById('setupError'),
    clapperboard: document.getElementById('clapperboard'),
    countdownScreen: document.getElementById('countdownScreen'),
    countdownNumber: document.getElementById('countdownNumber'),
    appContainer: document.getElementById('appContainer'),
    searchInput: document.getElementById('searchInput'),
    tabs: document.querySelectorAll('.tab'),
    hero: document.getElementById('hero'),
    contentContainer: document.getElementById('contentContainer'),
    detailModal: document.getElementById('detailModal'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalClose: document.getElementById('modalClose'),
    modalBody: document.getElementById('modalBody'),
    toastContainer: document.getElementById('toastContainer'),
    settingsBtn: document.getElementById('settingsBtn'),
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState')
};

// ========== SETUP & VALIDATION ==========
function showSetupPage() {
    el.setupPage.style.display = 'flex';
    el.appContainer.style.display = 'none';
    setTimeout(() => el.clapperboard.classList.add('clap'), 500);
}

async function validateTMDb(key) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/configuration?api_key=${key}`);
        return response.ok;
    } catch {
        return false;
    }
}

function showError(msg) {
    el.setupError.textContent = msg;
    el.setupError.style.display = 'block';
    setTimeout(() => el.setupError.style.display = 'none', 4000);
}

el.setupBtn.addEventListener('click', async () => {
    const tmdb = el.tmdbKey.value.trim();
    const omdb = el.omdbKey.value.trim();

    if (!tmdb) {
        showError('TMDb API key is required');
        return;
    }

    el.setupBtn.disabled = true;
    el.setupBtn.innerHTML = '<span>Validating...</span>';

    const valid = await validateTMDb(tmdb);

    if (valid) {
        localStorage.setItem('tmdb_api_key', tmdb);
        CONFIG.API_KEY = tmdb;

        if (omdb) {
            localStorage.setItem('omdb_api_key', omdb);
            CONFIG.OMDB_KEY = omdb;
        }

        el.setupPage.style.display = 'none';
        showCountdown();
    } else {
        showError('Invalid TMDb API key. Please check and try again.');
        el.setupBtn.disabled = false;
        el.setupBtn.innerHTML = '<span>Launch Cinema</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    }
});

// ========== COUNTDOWN ==========
function showCountdown() {
    el.countdownScreen.style.display = 'flex';
    let count = 3;

    const interval = setInterval(() => {
        if (count > 0) {
            el.countdownNumber.textContent = count;
            count--;
        } else {
            clearInterval(interval);
            el.countdownScreen.style.opacity = '0';
            setTimeout(() => {
                el.countdownScreen.style.display = 'none';
                el.appContainer.style.display = 'block';
                setTimeout(() => {
                    el.appContainer.style.opacity = '1';
                    init();
                }, 50);
            }, 500);
        }
    }, 1000);
}

// ========== API FUNCTIONS ==========
async function api(endpoint, params = {}) {
    const url = new URL(`${CONFIG.API_BASE}${endpoint}`);
    url.searchParams.append('api_key', CONFIG.API_KEY);
    Object.entries(params).forEach(([k, v]) => v && url.searchParams.append(k, v));

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showToast('Failed to fetch data', 'error');
        return null;
    }
}

async function getTrending(type = 'movie') {
    return await api(`/trending/${type}/week`);
}

async function getTopRated(type = 'movie') {
    return await api(`/${type}/top_rated`);
}

async function getDetails(id, type = 'movie') {
    return await api(`/${type}/${id}`, { append_to_response: 'credits,videos' });
}

async function getGenres(type = 'movie') {
    return await api(`/genre/${type}/list`);
}

async function search(query, type = 'multi') {
    return await api(`/search/${type}`, { query });
}

async function discoverByGenre(genreId, type = 'movie') {
    return await api(`/discover/${type}`, { with_genres: genreId });
}

// OMDb - IMDb Ratings
async function getIMDb(imdbId) {
    if (state.imdbCache[imdbId]) return state.imdbCache[imdbId];
    if (!CONFIG.OMDB_KEY) return null;

    try {
        const response = await fetch(`${CONFIG.OMDB_BASE}/?apikey=${CONFIG.OMDB_KEY}&i=${imdbId}`);
        const data = await response.json();

        if (data.Response === 'True' && data.imdbRating !== 'N/A') {
            state.imdbCache[imdbId] = data.imdbRating;
            localStorage.setItem('imdb_cache', JSON.stringify(state.imdbCache));
            return data.imdbRating;
        }
    } catch (error) {
        console.error('OMDb Error:', error);
    }

    return null;
}

// ========== RENDER FUNCTIONS ==========
function createCard(item, showNumber = false, number = 0) {
    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || '').split('-')[0];
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const poster = item.poster_path
        ? `${CONFIG.IMAGE_BASE}/${CONFIG.POSTER}${item.poster_path}`
        : 'https://via.placeholder.com/500x750/1a1a1a/666?text=No+Image';
    const type = item.media_type || (state.currentTab === 'series' ? 'tv' : 'movie');

    return `
        <div class="movie-card" onclick="showDetails(${item.id}, '${type}')">
            ${showNumber ? `<div class="number-badge">${number}</div>` : ''}
            <img src="${poster}" alt="${title}" class="movie-poster" loading="lazy">
            <div class="movie-info">
                <div class="movie-title">${title}</div>
                <div class="movie-meta">
                    <span>${year || 'N/A'}</span>
                    <span class="rating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        ${rating}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function renderRow(title, items, showNumbers = false) {
    return `
        <section class="content-row">
            <div class="row-header">
                <h2>${title}</h2>
            </div>
            <div class="row-content">
                ${items.slice(0, 10).map((item, i) => createCard(item, showNumbers, i + 1)).join('')}
            </div>
        </section>
    `;
}

// ========== TAB SYSTEM ==========
async function loadHome() {
    showLoading();
    el.contentContainer.innerHTML = '';

    const [trendingMovies, trendingSeries, topMovies, topSeries] = await Promise.all([
        getTrending('movie'),
        getTrending('tv'),
        getTopRated('movie'),
        getTopRated('tv')
    ]);

    // Hero - Featured movie
    if (trendingMovies && trendingMovies.results[0]) {
        loadHero(trendingMovies.results[0]);
    }

    // Content rows
    let content = '';
    if (trendingMovies) content += renderRow('Top 10 Trending Movies', trendingMovies.results, true);
    if (trendingSeries) content += renderRow('Top 10 Trending Series', trendingSeries.results, true);
    if (topMovies) content += renderRow('Top Rated Movies of All Time', topMovies.results, true);
    if (topSeries) content += renderRow('Top Rated Series of All Time', topSeries.results, true);

    el.contentContainer.innerHTML = content;
    hideLoading();
}

async function loadMovies() {
    showLoading();
    el.contentContainer.innerHTML = '';
    state.currentTab = 'movies';

    const [trending, topRated, popular] = await Promise.all([
        getTrending('movie'),
        getTopRated('movie'),
        api('/movie/popular')
    ]);

    // Hero - Top rated movie
    if (topRated && topRated.results[0]) {
        loadHero(topRated.results[0]);
    }

    // Content rows - MOVIES ONLY
    let content = '';
    if (trending) content += renderRow('Trending Movies', trending.results, true);
    if (topRated) content += renderRow('Top Rated Movies', topRated.results, true);
    if (popular) content += renderRow('Popular Movies', popular.results, false);

    el.contentContainer.innerHTML = content;
    hideLoading();
}

async function loadSeries() {
    showLoading();
    el.contentContainer.innerHTML = '';
    state.currentTab = 'series';

    const [trending, topRated, popular] = await Promise.all([
        getTrending('tv'),
        getTopRated('tv'),
        api('/tv/popular')
    ]);

    // Hero - Top rated series
    if (topRated && topRated.results[0]) {
        loadHero(topRated.results[0], 'tv');
    }

    // Content rows - SERIES ONLY
    let content = '';
    if (trending) content += renderRow('Trending Series', trending.results, true);
    if (topRated) content += renderRow('Top Rated Series', topRated.results, true);
    if (popular) content += renderRow('Popular Series', popular.results, false);

    el.contentContainer.innerHTML = content;
    hideLoading();
}

async function loadFavorites() {
    showLoading();
    el.contentContainer.innerHTML = '';
    el.hero.style.backgroundImage = '';

    if (state.favorites.length === 0) {
        el.contentContainer.innerHTML = `
            <div class="empty-state show">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <h3>No favorites yet</h3>
                <p>Start adding movies and series to your favorites!</p>
            </div>
        `;
        hideLoading();
        return;
    }

    // Separate movies and series
    const movies = state.favorites.filter(item => item.media_type === 'movie');
    const series = state.favorites.filter(item => item.media_type === 'tv');

    let content = '';
    if (movies.length > 0) {
        content += renderRow('Favorite Movies', movies, false);
    }
    if (series.length > 0) {
        content += renderRow('Favorite Series', series, false);
    }

    el.contentContainer.innerHTML = content;
    hideLoading();
}

function loadHero(item, type = 'movie') {
    if (!item) return;
    const backdrop = item.backdrop_path
        ? `${CONFIG.IMAGE_BASE}/${CONFIG.BACKDROP}${item.backdrop_path}`
        : '';
    el.hero.style.backgroundImage = `url(${backdrop})`;
}

// ========== DETAIL MODAL ==========
async function showDetails(id, type) {
    const data = await getDetails(id, type);
    if (!data) return;

    const title = data.title || data.name;
    const backdrop = data.backdrop_path ? `${CONFIG.IMAGE_BASE}/${CONFIG.BACKDROP}${data.backdrop_path}` : '';
    const poster = data.poster_path ? `${CONFIG.IMAGE_BASE}/${CONFIG.POSTER}${data.poster_path}` : '';
    const tmdbRating = data.vote_average.toFixed(1);
    const trailer = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    // Get IMDb rating
    let imdbRating = null;
    if (data.imdb_id && CONFIG.OMDB_KEY) {
        imdbRating = await getIMDb(data.imdb_id);
    }

    el.modalBody.innerHTML = `
        <div class="detail-backdrop" style="background-image:url(${backdrop})"></div>
        <div class="detail-content">
            <div class="detail-header">
                <img src="${poster}" alt="${title}" class="detail-poster">
                <div class="detail-info">
                    <h2>${title}</h2>
                    <div class="rating-badges">
                        <span class="rating-badge tmdb-badge">⭐ ${tmdbRating}</span>
                        ${imdbRating ? `<span class="rating-badge imdb-badge">IMDb ${imdbRating}</span>` : ''}
                    </div>
                    <p class="detail-overview">${data.overview}</p>
                    ${trailer ? `
                        <div style="margin-top:1.5rem">
                            <iframe width="100%" height="350" src="https://www.youtube.com/embed/${trailer.key}" 
                                frameborder="0" allowfullscreen style="border-radius:12px"></iframe>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    el.detailModal.classList.add('show');
}

function closeModal() {
    el.detailModal.classList.remove('show');
}

el.modalClose.addEventListener('click', closeModal);
el.modalBackdrop.addEventListener('click', closeModal);

// ========== TAB NAVIGATION ==========
el.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        el.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tabName = tab.dataset.tab;
        state.currentTab = tabName;

        if (tabName === 'home') loadHome();
        else if (tabName === 'movies') loadMovies();
        else if (tabName === 'series') loadSeries();
        else if (tabName === 'favorites') loadFavorites();
    });
});

// ========== SEARCH ==========
let searchTimeout;
el.searchInput.addEventListener('input', e => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length < 2) {
        if (state.currentTab === 'home') loadHome();
        else if (state.currentTab === 'movies') loadMovies();
        else if (state.currentTab === 'series') loadSeries();
        return;
    }

    searchTimeout = setTimeout(async () => {
        showLoading();
        const results = await search(query, 'multi');

        if (results && results.results) {
            el.contentContainer.innerHTML = renderRow(`Search Results for "${query}"`, results.results, false);
        }
        hideLoading();
    }, 300);
});

// ========== SETTINGS ==========
el.settingsBtn.addEventListener('click', () => {
    if (confirm('Change API keys? This will reload the page.')) {
        localStorage.removeItem('tmdb_api_key');
        localStorage.removeItem('omdb_api_key');
        location.reload();
    }
});

// ========== HELPERS ==========
function showLoading() {
    el.loadingState.classList.add('show');
    el.emptyState.classList.remove('show');
}

function hideLoading() {
    el.loadingState.classList.remove('show');
}

function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    el.toastContainer.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        el.searchInput.focus();
    }
    if (e.key === 'Escape' && el.detailModal.classList.contains('show')) {
        closeModal();
    }
});

// ========== INITIALIZATION ==========
function init() {
    if (!CONFIG.API_KEY) {
        showSetupPage();
    } else {
        el.setupPage.style.display = 'none';
        el.countdownScreen.style.display = 'none';
        el.appContainer.style.display = 'block';
        el.appContainer.style.opacity = '1';
        loadHome();
    }
}

// START APP
CONFIG.API_KEY ? init() : showSetupPage();
