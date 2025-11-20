// ============================================
// BingeBase v1.1 - IMAX Edition
// ============================================

// Configuration
const CONFIG = {
    API_KEY: localStorage.getItem('tmdb_api_key') || '',
    OMDB_API_KEY: localStorage.getItem('omdb_api_key') || '',
    API_BASE: 'https://api.themoviedb.org/3',
    OMDB_BASE: 'https://www.omdbapi.com',
    IMAGE_BASE: 'https://image.tmdb.org/t/p',
    POSTER_SIZE: 'w500',
    BACKDROP_SIZE: 'original',
    VERSION: '1.1.1'
};

// State Management
const state = {
    currentTab: 'movies',
    searchQuery: '',
    searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    isSetupComplete: !!localStorage.getItem('tmdb_api_key')
};

// DOM Elements
const elements = {
    setupPage: document.getElementById('setupPage'),
    setupForm: document.getElementById('setupForm'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    setupBtn: document.getElementById('setupBtn'),
    setupError: document.getElementById('setupError'),
    countdownScreen: document.getElementById('countdownScreen'),
    appContainer: document.querySelector('.app-container'),
    settingsBtn: document.getElementById('settingsBtn'),
    searchInput: document.getElementById('searchInput'),
    searchHistory: document.getElementById('searchHistory'),
    historyList: document.getElementById('historyList'),
    clearHistory: document.getElementById('clearHistory'),
    tabs: document.querySelectorAll('.tab'),
    resultsGrid: document.getElementById('resultsGrid'),
    loading: document.getElementById('loading'),
    emptyState: document.getElementById('emptyState'),
    sectionHeader: document.getElementById('sectionHeader'),
    detailModal: document.getElementById('detailModal'),
    modalClose: document.getElementById('modalClose'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalBody: document.getElementById('modalBody'),
    toastContainer: document.getElementById('toastContainer')
};

// ============================================
// Setup & API Key Management
// ============================================

function showSetupPage() {
    elements.setupPage.style.display = 'flex';
    elements.appContainer.style.display = 'none';

    // Animate clapperboard
    setTimeout(() => {
        const clapper = document.getElementById('clapperboard');
        if (clapper) {
            clapper.classList.add('clap');
        }
    }, 500);
}

function hideSetupPage() {
    elements.setupPage.style.display = 'none';
}

async function validateAPIKey(apiKey) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/configuration?api_key=${apiKey}`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

elements.setupBtn.addEventListener('click', async () => {
    const apiKey = elements.apiKeyInput.value.trim();
    const omdbKey = document.getElementById('omdbKeyInput').value.trim();

    if (!apiKey) {
        showSetupError('Please enter your TMDb API key');
        return;
    }

    elements.setupBtn.disabled = true;
    elements.setupBtn.innerHTML = '<span>Validating...</span>';

    const isValid = await validateAPIKey(apiKey);

    if (isValid) {
        localStorage.setItem('tmdb_api_key', apiKey);
        CONFIG.API_KEY = apiKey;

        // Save OMDb key if provided (optional)
        if (omdbKey) {
            localStorage.setItem('omdb_api_key', omdbKey);
            CONFIG.OMDB_API_KEY = omdbKey;
        }

        state.isSetupComplete = true;

        // Hide setup page
        hideSetupPage();

        // Show IMAX countdown
        showCountdown();
    } else {
        showSetupError('Invalid TMDb API key. Please check and try again.');
        elements.setupBtn.disabled = false;
        elements.setupBtn.innerHTML = '<span>Launch BingeBase</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    }
});

function showSetupError(message) {
    elements.setupError.textContent = message;
    elements.setupError.style.display = 'block';
    setTimeout(() => {
        elements.setupError.style.display = 'none';
    }, 3000);
}

// Settings button to change API key
elements.settingsBtn.addEventListener('click', () => {
    const confirmChange = confirm('Do you want to change your API key?');
    if (confirmChange) {
        localStorage.removeItem('tmdb_api_key');
        location.reload();
    }
});

// ============================================
// IMAX Countdown Animation
// ============================================

function showCountdown() {
    elements.countdownScreen.style.display = 'flex';

    let count = 3;
    const countdownNumber = document.getElementById('countdownNumber');

    const countInterval = setInterval(() => {
        if (count > 0) {
            countdownNumber.textContent = count;
            count--;
        } else {
            clearInterval(countInterval);
            // Fade out countdown
            elements.countdownScreen.style.opacity = '0';
            setTimeout(() => {
                elements.countdownScreen.style.display = 'none';
                elements.appContainer.style.display = 'block';
                elements.appContainer.style.opacity = '0';
                setTimeout(() => {
                    elements.appContainer.style.opacity = '1';
                }, 50);
                init();
            }, 500);
        }
    }, 1000);
}

// ============================================
// API Functions
// ============================================

async function fetchFromAPI(endpoint, params = {}) {
    const url = new URL(`${CONFIG.API_BASE}${endpoint}`);
    url.searchParams.append('api_key', CONFIG.API_KEY);

    Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
    });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showToast('Failed to fetch data. Please try again.', 'error');
        return null;
    }
}

async function searchContent(query, type = 'movie', page = 1) {
    const endpoint = `/search/${type}`;
    return await fetchFromAPI(endpoint, { query, page });
}

async function getTrending(type = 'movie') {
    return await fetchFromAPI(`/trending/${type}/week`);
}

async function getDetails(id, type = 'movie') {
    const data = await fetchFromAPI(`/${type}/${id}`, { append_to_response: 'credits,videos' });
    return data;
}

async function getByActor(actorId, type = 'movie') {
    return await fetchFromAPI(`/discover/${type}`, { with_cast: actorId });
}

// ============================================
// OMDb API - IMDb Ratings (Cached)
// ============================================

const imdbCache = JSON.parse(localStorage.getItem('imdb_ratings')) || {};

async function getIMDbRating(imdbId) {
    // Check cache first
    if (imdbCache[imdbId]) {
        return imdbCache[imdbId];
    }

    // No OMDb key? Skip gracefully
    if (!CONFIG.OMDB_API_KEY) {
        return null;
    }

    try {
        const response = await fetch(`${CONFIG.OMDB_BASE}/?apikey=${CONFIG.OMDB_API_KEY}&i=${imdbId}`);
        const data = await response.json();

        if (data.Response === 'True' && data.imdbRating && data.imdbRating !== 'N/A') {
            const rating = data.imdbRating;
            // Cache it forever
            imdbCache[imdbId] = rating;
            localStorage.setItem('imdb_ratings', JSON.stringify(imdbCache));
            return rating;
        }
    } catch (error) {
        console.warn('OMDb API call failed:', error);
    }

    return null;
}

// ============================================
// Search Functionality
// ============================================

let searchTimeout;

elements.searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    clearTimeout(searchTimeout);

    if (query.length === 0) {
        loadTrending();
        elements.searchHistory.style.display = 'none';
        return;
    }

    if (query.length < 2) return;

    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 300);
});

elements.searchInput.addEventListener('focus', () => {
    if (state.searchHistory.length > 0 && !elements.searchInput.value) {
        renderSearchHistory();
        elements.searchHistory.style.display = 'block';
    }
});

elements.searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        elements.searchHistory.style.display = 'none';
    }, 200);
});

async function performSearch(query) {
    state.searchQuery = query;
    state.isLoading = true;

    showLoading();

    const type = state.currentTab === 'tv' ? 'tv' : 'movie';
    const data = await searchContent(query, type);

    state.isLoading = false;

    if (data && data.results) {
        addToSearchHistory(query);
        renderResults(data.results);
        elements.sectionHeader.querySelector('h2').textContent = `Results for "${query}"`;
    } else {
        showEmptyState();
    }
}

function addToSearchHistory(query) {
    if (!state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query);
        state.searchHistory = state.searchHistory.slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory));
    }
}

function renderSearchHistory() {
    elements.historyList.innerHTML = state.searchHistory.map(query => `
        <div class="history-item" onclick="searchFromHistory('${query}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${query}
        </div>
    `).join('');
}

function searchFromHistory(query) {
    elements.searchInput.value = query;
    performSearch(query);
    elements.searchHistory.style.display = 'none';
}

elements.clearHistory.addEventListener('click', () => {
    state.searchHistory = [];
    localStorage.removeItem('searchHistory');
    elements.searchHistory.style.display = 'none';
    showToast('Search history cleared', 'success');
});

// ============================================
// Tab Navigation
// ============================================

elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        elements.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        state.currentTab = tabName;
        elements.searchInput.value = '';

        if (tabName === 'favorites') {
            renderFavorites();
        } else {
            loadTrending();
        }
    });
});

// ============================================
// Rendering Functions
// ============================================

function renderResults(results) {
    hideLoading();
    hideEmptyState();

    if (results.length === 0) {
        showEmptyState();
        return;
    }

    elements.resultsGrid.innerHTML = results.map(item => createContentCard(item)).join('');
}

function createContentCard(item) {
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : 'N/A';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const posterPath = item.poster_path
        ? `${CONFIG.IMAGE_BASE}/${CONFIG.POSTER_SIZE}${item.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const isFavorite = state.favorites.some(fav => fav.id === item.id);
    const type = item.media_type || (state.currentTab === 'tv' ? 'tv' : 'movie');

    return `
        <div class="content-card" onclick="showDetails(${item.id}, '${type}')">
            <img src="${posterPath}" alt="${title}" class="card-poster" loading="lazy">
            <div class="card-info">
                <h3 class="card-title">${title}</h3>
                <div class="card-meta">
                    <span class="card-year">${year}</span>
                    <span class="card-rating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        ${rating}
                    </span>
                </div>
                <div class="card-actions">
                    <button class="icon-btn ${isFavorite ? 'active' : ''}" 
                            onclick="event.stopPropagation(); toggleFavorite(${item.id}, '${type}', '${title.replace(/'/g, "\\'")}', '${posterPath}', ${rating})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// Favorites Management
// ============================================

function toggleFavorite(id, type, title, poster, rating) {
    const index = state.favorites.findIndex(fav => fav.id === id);

    if (index === -1) {
        state.favorites.push({ id, type, title, poster, rating });
        showToast(`Added "${title}" to favorites`, 'success');
    } else {
        state.favorites.splice(index, 1);
        showToast(`Removed "${title}" from favorites`, 'info');
    }

    localStorage.setItem('favorites', JSON.stringify(state.favorites));

    if (state.currentTab === 'favorites') {
        renderFavorites();
    }
}

function renderFavorites() {
    elements.sectionHeader.querySelector('h2').textContent = 'My Favorites';

    if (state.favorites.length === 0) {
        showEmptyState();
        elements.emptyState.querySelector('h3').textContent = 'No favorites yet';
        elements.emptyState.querySelector('p').textContent = 'Start adding movies and TV shows to your collection';
        return;
    }

    hideEmptyState();
    elements.resultsGrid.innerHTML = state.favorites.map(item => `
        <div class="content-card" onclick="showDetails(${item.id}, '${item.type}')">
            <img src="${item.poster}" alt="${item.title}" class="card-poster" loading="lazy">
            <div class="card-info">
                <h3 class="card-title">${item.title}</h3>
                <div class="card-meta">
                    <span class="card-rating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        ${item.rating}
                    </span>
                </div>
                <div class="card-actions">
                    <button class="icon-btn active" onclick="event.stopPropagation(); toggleFavorite(${item.id}, '${item.type}', '${item.title.replace(/'/g, "\\'")}', '${item.poster}', ${item.rating})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Detail Modal
// ============================================

async function showDetails(id, type) {
    const data = await getDetails(id, type);

    if (!data) return;

    const title = data.title || data.name;
    const backdropPath = data.backdrop_path
        ? `${CONFIG.IMAGE_BASE}/${CONFIG.BACKDROP_SIZE}${data.backdrop_path}`
        : '';
    const posterPath = data.poster_path
        ? `${CONFIG.IMAGE_BASE}/${CONFIG.POSTER_SIZE}${data.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const runtime = data.runtime || (data.episode_run_time && data.episode_run_time[0]) || 'N/A';
    const genres = data.genres.map(g => g.name).join(', ');
    const cast = data.credits.cast.slice(0, 10);
    const trailer = data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    // TMDb rating
    const tmdbRating = data.vote_average.toFixed(1);

    // Fetch IMDb rating (only if we have IMDb ID and OMDb key)
    let imdbRating = null;
    if (data.imdb_id && CONFIG.OMDB_API_KEY) {
        imdbRating = await getIMDbRating(data.imdb_id);
    }

    elements.modalBody.innerHTML = `
        <div class="detail-backdrop" style="background-image: url('${backdropPath}')"></div>
        <div class="detail-content">
            <div class="detail-header">
                <img src="${posterPath}" alt="${title}" class="detail-poster">
                <div class="detail-info">
                    <h2 class="detail-title">${title}</h2>
                    <div class="detail-meta">
                        <span>${new Date(data.release_date || data.first_air_date).getFullYear()}</span>
                        <span>•</span>
                        <span>${runtime} min</span>
                        <span>•</span>
                        <span class="rating-badge tmdb-badge">⭐ ${tmdbRating}</span>
                        ${imdbRating ? `<span class="rating-badge imdb-badge">IMDb ${imdbRating}</span>` : ''}
                    </div>
                    <div class="detail-genres">${genres}</div>
                    <p class="detail-overview">${data.overview}</p>
                    ${trailer ? `
                        <div class="trailer-container">
                            <iframe 
                                width="100%" 
                                height="400" 
                                src="https://www.youtube.com/embed/${trailer.key}" 
                                frameborder="0" 
                                allowfullscreen
                            ></iframe>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Cast</h3>
                <div class="cast-grid">
                    ${cast.map(actor => `
                        <div class="cast-card" onclick="searchByActor(${actor.id}, '${actor.name}')">
                            <img src="${actor.profile_path ? CONFIG.IMAGE_BASE + '/w185' + actor.profile_path : 'https://via.placeholder.com/185x278?text=No+Image'}" alt="${actor.name}">
                            <div class="cast-info">
                                <div class="cast-name">${actor.name}</div>
                                <div class="cast-character">${actor.character}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    elements.detailModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    elements.detailModal.style.display = 'none';
    document.body.style.overflow = '';
}

elements.modalClose.addEventListener('click', closeModal);
elements.modalBackdrop.addEventListener('click', closeModal);

// ============================================
// Actor-Based Search
// ============================================

async function searchByActor(actorId, actorName) {
    closeModal();
    showLoading();

    const type = state.currentTab === 'tv' ? 'tv' : 'movie';
    const data = await getByActor(actorId, type);

    if (data && data.results) {
        renderResults(data.results);
        elements.sectionHeader.querySelector('h2').textContent = `${actorName}'s ${type === 'tv' ? 'TV Shows' : 'Movies'}`;
        showToast(`Showing content featuring ${actorName}`, 'info');
    }
}

// ============================================
// Loading Trending Content
// ============================================

async function loadTrending() {
    const type = state.currentTab === 'tv' ? 'tv' : 'movie';
    showLoading();

    const data = await getTrending(type);

    if (data && data.results) {
        renderResults(data.results);
        elements.sectionHeader.querySelector('h2').textContent = `Trending ${type === 'tv' ? 'TV Shows' : 'Movies'}`;
    }
}

// ============================================
// UI Helper Functions
// ============================================

function showLoading() {
    elements.loading.style.display = 'block';
    elements.resultsGrid.style.display = 'none';
    elements.emptyState.style.display = 'none';
}

function hideLoading() {
    elements.loading.style.display = 'none';
    elements.resultsGrid.style.display = 'grid';
}

function showEmptyState() {
    elements.emptyState.style.display = 'block';
    elements.resultsGrid.style.display = 'none';
    elements.loading.style.display = 'none';
}

function hideEmptyState() {
    elements.emptyState.style.display = 'none';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        elements.searchInput.focus();
    }

    if (e.key === 'Escape' && elements.detailModal.style.display === 'flex') {
        closeModal();
    }
});

// ============================================
// Initialize App
// ============================================

function init() {
    if (!state.isSetupComplete) {
        showSetupPage();
    } else {
        hideSetupPage();
        elements.countdownScreen.style.display = 'none';
        elements.appContainer.style.display = 'block';
        loadTrending();
    }
}

// Start the app
init();
