// BingeBase v2.0 Ultra - God Mode Edition
// Configuration
const CONFIG = { API_KEY: localStorage.getItem('tmdb_api_key') || '', OMDB_KEY: localStorage.getItem('omdb_api_user'), API_BASE: 'https://api.themoviedb.org/3', OMDB_BASE: 'https://www.omdbapi.com', IMAGE_BASE: 'https://image.tmdb.org/t/p', POSTER: 'w500', BACKDROP: 'original' };

// State
const state = { currentTab: 'home', favorites: JSON.parse(localStorage.getItem('favorites')) || [], searchHistory: JSON.parse(localStorage.getItem('search_history')) || [], imdbCache: JSON.parse(localStorage.getItem('imdb_cache')) || {} };

// DOM Elements
const el = { setupPage: document.getElementById('setupPage'), tmdbKey: document.getElementById('tmdbKey'), omdbKey: document.getElementById('omdbKey'), setupBtn: document.getElementById('setupBtn'), setupError: document.getElementById('setupError'), clapperboard: document.getElementById('clapperboard'), countdownScreen: document.getElementById('countdownScreen'), countdownNumber: document.getElementById('countdownNumber'), appContainer: document.getElementById('appContainer'), searchInput: document.getElementById('searchInput'), tabs: document.querySelectorAll('.tab'), hero: document.getElementById('hero'), trendingMoviesContent: document.getElementById('trendingMoviesContent'), trendingSeriesContent: document.getElementById('trendingSeriesContent'), categoryGrid: document.getElementById('categoryGrid'), topRatedMoviesContent: document.getElementById('topRatedMoviesContent'), topRatedSeriesContent: document.getElementById('topRatedSeriesContent'), detailModal: document.getElementById('detailModal'), modalBackdrop: document.getElementById('modalBackdrop'), modalClose: document.getElementById('modalClose'), modalBody: document.getElementById('modalBody'), toastContainer: document.getElementById('toastContainer'), settingsBtn: document.getElementById('settingsBtn'), loadingState: document.getElementById('loadingState'), emptyState: document.getElementById('emptyState') };

// Setup Page
function showSetupPage() { el.setupPage.style.display = 'flex'; el.appContainer.style.display = 'none'; setTimeout(() => el.clapperboard.classList.add('clap'), 500) }

async function validateTMDb(key) { try { const r = await fetch(`${CONFIG.API_BASE}/configuration?api_key=${key}`); return r.ok } catch { return false } }

el.setupBtn.addEventListener('click', async () => { const tmdb = el.tmdbKey.value.trim(), omdb = el.omdbKey.value.trim(); if (!tmdb) { showError('TMDb API key required'); return } el.setupBtn.disabled = true; el.setupBtn.innerHTML = '<span>Validating...</span>'; const valid = await validateTMDb(tmdb); if (valid) { localStorage.setItem('tmdb_api_key', tmdb); CONFIG.API_KEY = tmdb; if (omdb) { localStorage.setItem('omdb_api_key', omdb); CONFIG.OMDB_KEY = omdb } hideSetup(); showCountdown() } else { showError('Invalid TMDb API key'); el.setupBtn.disabled = false; el.setupBtn.innerHTML = '<span>Launch Experience</span>' } });

function showError(msg) { el.setupError.textContent = msg; el.setupError.style.display = 'block'; setTimeout(() => el.setupError.style.display = 'none', 3000) }

function hideSetup() { el.setupPage.style.display = 'none' }

// Countdown
function showCountdown() { el.countdownScreen.style.display = 'flex'; let count = 3; const interval = setInterval(() => { if (count > 0) { el.countdownNumber.textContent = count; count-- } else { clearInterval(interval); el.countdownScreen.style.opacity = '0'; setTimeout(() => { el.countdownScreen.style.display = 'none'; el.appContainer.style.display = 'block'; setTimeout(() => el.appContainer.style.opacity = '1', 50); init() }, 500) } }, 1000) }

// API Functions
async function api(endpoint, params = {}) { const url = new URL(`${CONFIG.API_BASE}${endpoint}`); url.searchParams.append('api_key', CONFIG.API_KEY); Object.entries(params).forEach(([k, v]) => v && url.searchParams.append(k, v)); try { const r = await fetch(url); if (!r.ok) throw new Error(); return await r.json() } catch { showToast('Failed to fetch data', 'error'); return null } }

async function getTrending(type = 'movie') { return await api(`/trending/${type}/week`) }
async function getTopRated(type = 'movie') { return await api(`/${type}/top_rated`) }
async function getDetails(id, type = 'movie') { return await api(`/${type}/${id}`, { append_to_response: 'credits,videos' }) }
async function getGenres(type = 'movie') { return await api(`/genre/${type}/list`) }
async function search(query, type = 'movie') { return await api(`/search/${type}`, { query }) }

// OMDb - IMDb Ratings
async function getIMDb(imdbId) { if (state.imdbCache[imdbId]) return state.imdbCache[imdbId]; if (!CONFIG.OMDB_KEY) return null; try { const r = await fetch(`${CONFIG.OMDB_BASE}/?apikey=${CONFIG.OMDB_KEY}&i=${imdbId}`); const data = await r.json(); if (data.Response === 'True' && data.imdbRating !== 'N/A') { state.imdbCache[imdbId] = data.imdbRating; localStorage.setItem('imdb_cache', JSON.stringify(state.imdbCache)); return data.imdbRating } } catch { } return null }

// Render Functions
function createCard(item, showNumber = false, number = 0) { const title = item.title || item.name; const year = (item.release_date || item.first_air_date || '').split('-')[0]; const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A'; const poster = item.poster_path ? `${CONFIG.IMAGE_BASE}/${CONFIG.POSTER}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'; const type = item.media_type || (state.currentTab === 'series' ? 'tv' : 'movie'); return `<div class="movie-card" onclick="showDetails(${item.id},'${type}')">${showNumber ? `<div class="number-badge">${number}</div>` : ''}<img src="${poster}" alt="${title}" class="movie-poster" loading="lazy"><div class="movie-info"><div class="movie-title">${title}</div><div class="movie-meta"><span>${year || 'N/A'}</span><span class="rating"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>${rating}</span></div></div></div>` }

function renderRow(container, items, showNumbers = false) { container.innerHTML = items.slice(0, 10).map((item, i) => createCard(item, showNumbers, i + 1)).join('') }

// Load Content
async function loadHome() { showLoading(); const [trendingMovies, trendingSeries, topMovies, topSeries] = await Promise.all([getTrending('movie'), getTrending('tv'), getTopRated('movie'), getTopRated('tv')]); if (trendingMovies) renderRow(el.trendingMoviesContent, trendingMovies.results, true); if (trendingSeries) renderRow(el.trendingSeriesContent, trendingSeries.results, true); if (topMovies) renderRow(el.topRatedMoviesContent, topMovies.results, true); if (topSeries) renderRow(el.topRatedSeriesContent, topSeries.results, true); loadGenres(); hideLoading(); loadHero(trendingMovies?.results[0]) }

async function loadGenres() { const genres = [{ id: 28, name: 'Action', icon: '💥' }, { id: 35, name: 'Comedy', icon: '😂' }, { id: 18, name: 'Drama', icon: '🎭' }, { id: 27, name: 'Horror', icon: '👻' }, { id: 878, name: 'Sci-Fi', icon: '🚀' }, { id: 10749, name: 'Romance', icon: '💕' }, { id: 53, name: 'Thriller', icon: '🔫' }, { id: 16, name: 'Animation', icon: '🎨' }, { id: 99, name: 'Documentary', icon: '📽️' }, { id: 14, name: 'Fantasy', icon: '🧙' }, { id: 9648, name: 'Mystery', icon: '🔍' }]; el.categoryGrid.innerHTML = genres.map(g => `<div class="category-card" style="background:linear-gradient(135deg,rgba(94,92,230,0.2),rgba(118,75,162,0.2))" onclick="loadGenre(${g.id},'${g.name}')"><div class="category-icon">${g.icon}</div><div class="category-name">${g.name}</div></div>`).join('') }

function loadHero(item) { if (!item) return; const backdrop = item.backdrop_path ? `${CONFIG.IMAGE_BASE}/${CONFIG.BACKDROP}${item.backdrop_path}` : ''; el.hero.style.backgroundImage = `url(${backdrop})`; el.hero.style.backgroundSize = 'cover'; el.hero.style.backgroundPosition = 'center' }

// Detail Modal
async function showDetails(id, type) { const data = await getDetails(id, type); if (!data) return; const title = data.title || data.name; const backdrop = data.backdrop_path ? `${CONFIG.IMAGE_BASE}/${CONFIG.BACKDROP}${data.backdrop_path}` : ''; const poster = data.poster_path ? `${CONFIG.IMAGE_BASE}/${CONFIG.POSTER}${data.poster_path}` : ''; const tmdbRating = data.vote_average.toFixed(1); let imdbRating = null; if (data.imdb_id && CONFIG.OMDB_KEY) imdbRating = await getIMDb(data.imdb_id); const trailer = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube'); el.modalBody.innerHTML = `<div class="detail-backdrop" style="background-image:url(${backdrop});background-size:cover;background-position:center;height:400px"></div><div class="detail-content" style="padding:2rem"><div class="detail-header" style="display:flex;gap:2rem;margin-top:-100px;position:relative"><img src="${poster}" alt="${title}" style="width:200px;border-radius:12px;box-shadow:0 16px 48px rgba(0,0,0,0.8)"><div class="detail-info"><h2 style="font-size:2.5rem;margin-bottom:1rem">${title}</h2><div style="display:flex;gap:1rem;margin-bottom:1rem"><span style="background:rgba(255,255,255,0.1);padding:0.5rem 1rem;border-radius:8px">⭐ ${tmdbRating}</span>${imdbRating ? `<span style="background:#f5c518;color:#000;padding:0.5rem 1rem;border-radius:8px;font-weight:700">IMDb ${imdbRating}</span>` : ''}</div><p style="color:var(--gray-300);line-height:1.8">${data.overview}</p>${trailer ? `<div style="margin-top:1.5rem"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen style="border-radius:12px"></iframe></div>` : ''}</div></div></div>`; el.detailModal.classList.add('show') }

function closeModal() { el.detailModal.classList.remove('show') }
el.modalClose.addEventListener('click', closeModal);
el.modalBackdrop.addEventListener('click', closeModal);

// Tabs
el.tabs.forEach(tab => tab.addEventListener('click', () => { el.tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); state.currentTab = tab.dataset.tab; if (state.currentTab === 'home') loadHome() }));

// Search
let searchTimeout;
el.searchInput.addEventListener('input', e => { clearTimeout(searchTimeout); const query = e.target.value.trim(); if (query.length < 2) return; searchTimeout = setTimeout(async () => { const results = await search(query, 'movie'); if (results) { el.trendingMoviesContent.innerHTML = results.results.map(item => createCard(item)).join('') } }, 300) });

// Settings
el.settingsBtn.addEventListener('click', () => { if (confirm('Change API keys?')) { localStorage.removeItem('tmdb_api_key'); localStorage.removeItem('omdb_api_key'); location.reload() } });

// Helpers
function showLoading() { el.loadingState.classList.add('show') }
function hideLoading() { el.loadingState.classList.remove('show') }
function showToast(msg, type = 'info') { const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = msg; el.toastContainer.appendChild(toast); setTimeout(() => toast.remove(), 3000) }

// Keyboard Shortcuts
document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); el.searchInput.focus() } if (e.key === 'Escape' && el.detailModal.classList.contains('show')) closeModal() });

// Init
function init() { if (!CONFIG.API_KEY) { showSetupPage() } else { el.setupPage.style.display = 'none'; el.countdownScreen.style.display = 'none'; el.appContainer.style.display = 'block'; el.appContainer.style.opacity = '1'; loadHome() } }

// Start
CONFIG.API_KEY ? init() : showSetupPage();
