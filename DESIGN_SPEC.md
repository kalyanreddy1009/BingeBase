# BingeBase v2.0 - Complete Design Specification
## Ultra Premium Cinema Experience

> **Blueprint Document**: Use this file to recreate the entire project from scratch

---

## 📋 Project Overview

**Name**: BingeBase  
**Version**: 2.0.0 "God Mode"  
**Type**: Premium Cinema Discovery Web Application  
**Tech Stack**: HTML5, CSS3, Vanilla JavaScript, Node.js/Express  
**APIs**: TMDb API (primary), OMDb API (optional - IMDb ratings)  
**Target**: Modern browsers, 60fps animations, Netflix/Apple TV+ quality

---

## 🎨 Design System

### Color Palette
```css
/* Core Colors */
--black: #000000              /* Pure black - main background */
--gray-900: #121212           /* Elevated surfaces */
--gray-800: #1a1a1a           /* Cards background */
--gray-700: #242424           /* Borders, separators */
--gray-600: #333333           /* Hover states */
--gray-500: #737373           /* Tertiary text */
--gray-300: #b3b3b3           /* Secondary text */
--white: #ffffff              /* Primary text */

/* Accent Colors */
--blue: #0071e3               /* Apple blue - primary actions */
--purple: #5e5ce6             /* Premium purple - gradients */
--pink: #ff375f               /* Netflix red-pink - alerts */
--gold: #ffd60a               /* Premium highlights - ratings */
--imdb: #f5c518               /* IMDb brand yellow */

/* Gradients */
--gradient-premium: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-blue-purple: linear-gradient(135deg, #0071e3, #5e5ce6)
--gradient-dark: linear-gradient(135deg, #000 0%, #1a1a2e 50%, #000 100%)
```

### Typography
```css
/* Font Family */
Font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
CDN: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap

/* Font Sizes */
--text-xs: 0.75rem      /* 12px - labels, hints */
--text-sm: 0.875rem     /* 14px - metadata */
--text-base: 1rem       /* 16px - body text */
--text-lg: 1.125rem     /* 18px - subtitles */
--text-xl: 1.25rem      /* 20px - section headers */
--text-2xl: 1.5rem      /* 24px - card headers */
--text-3xl: 1.875rem    /* 30px - page titles */
--text-4xl: 2.25rem     /* 36px - hero titles */
--text-5xl: 3rem        /* 48px - display */
--text-8xl: 8rem        /* 128px - countdown */

/* Font Weights */
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Spacing Scale
```css
--space-1: 0.25rem     /* 4px */
--space-2: 0.5rem      /* 8px */
--space-3: 0.75rem     /* 12px */
--space-4: 1rem        /* 16px */
--space-6: 1.5rem      /* 24px */
--space-8: 2rem        /* 32px */
--space-12: 3rem       /* 48px */
--space-16: 4rem       /* 64px */
```

### Border Radius
```css
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 20px
--radius-full: 9999px
```

### Shadows & Depth
```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.3)
--shadow-md: 0 4px 16px rgba(0,0,0,0.4)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.5)
--shadow-xl: 0 16px 48px rgba(0,0,0,0.6)
--shadow-2xl: 0 24px 64px rgba(0,0,0,0.7)
--shadow-glow-blue: 0 0 20px rgba(0,113,227,0.6)
```

### Animation Timing
```css
/* Easings */
--ease-out: cubic-bezier(0.33, 1, 0.68, 1)
--ease-in: cubic-bezier(0.32, 0, 0.67, 0)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)

/* Durations */
--duration-fast: 150ms
--duration-normal: 250ms
--duration-slow: 350ms
--duration-slower: 500ms
```

---

## 🏗️ Component Specifications

### 1. Setup Page
**Purpose**: First-time user onboarding, API key configuration

**Layout**:
- Full-screen fixed overlay (z-index: 2000)
- Centered card (max-width: 500px)
- Gradient animated background
- Glassmorphism card effect

**Elements**:
- Clapperboard animation (200px width)
  - Animated clap on load (0.4s)
  - Black/white diagonal stripes
  - Gold title text
- Logo circle (80px, gradient background)
- Title: "Welcome to BingeBase" (2.5rem, gradient text)
- Subtitle: "Your Premium Cinema Universe"
- Input Group 1: TMDb API Key
  - Lock icon prefix
  - Placeholder: "Enter your TMDb API key"
  - Link: "Get it free" → https://www.themoviedb.org/settings/api
- Input Group 2: OMDb API Key (Optional)
  - Star icon prefix  
  - Placeholder: "Enter OMDb key (optional)"
  - Link: "Get free key" → http://www.omdbapi.com/apikey.aspx
- Launch button: Full width, gradient, hover lift
- Error message: Pink background, conditional display
- Feature badges: 3 icons (Search, Favorites, Trailers)

**Animations**:
- Page fade-in: 0.6s
- Background pulse: 8s infinite
- Clapperboard slide-down: 0.8s spring
- Clap animation: 0.4s on load

### 2. IMAX Countdown
**Purpose**: 3-second cinematic transition

**Layout**:
- Full-screen black background (z-index: 3000)
- Center-aligned vertical layout

**Elements**:
- Film reel assembly:
  - Left reel (120px circle, spinning)
  - Film strip (3 frames, 50x70px each)
  - Right reel (120px circle, spinning)
- Countdown number (8rem, glowing, pulsing)
- Text: "Experience Begins" (uppercase, letter-spacing: 0.5em)

**Animations**:
- Reels spin: 3s linear infinite
- Number pulse: 1s ease-in-out infinite
- Fade out after countdown: 0.5s

### 3. Header
**Purpose**: Navigation, search, settings

**Layout**:
- Sticky position (top: 0, z-index: 100)
- Frosted glass blur: backdrop-filter blur(20px)
- Max-width: 1400px centered
- Two rows: Logo/Search/Settings + Tabs

**Row 1 Elements**:
- Logo: Film icon + "BingeBase" text (1.5rem, bold)
- Search bar: 
  - Flex: 1, max-width: 600px
  - Search icon prefix
  - Input placeholder: "Search movies, series, actors..."
  - Keyboard shortcut badge: "⌘K"
- Settings icon button (40px circle, gear icon)

**Row 2 - Tabs**:
- Home tab: House icon + "Home"
- Movies tab: Film icon + "Movies"
- Series tab: TV icon + "Series"
- Favorites tab: Heart icon + "Favorites"

**States**:
- Active tab: Light background, blue underline
- Hover: Light background, white text
- Search focus: Blue border, glow shadow

### 4. Movie Cards
**Purpose**: Display movie/series information

**Dimensions**:
- Min width: 250px
- Aspect ratio: 2:3 (poster)
- Border radius: 12px

**Structure**:
```
┌─────────────────┐
│                 │
│   Poster Image  │ ← Lazy loaded, blur-up
│   (2:3 ratio)   │
│                 │
├─────────────────┤
│ Title           │ ← 1rem, bold, ellipsis
│ 2024 • ⭐ 8.5  │ ← Metadata row
└─────────────────┘
```

**Hover Effect**:
- Transform: translateY(-8px) scale(1.03)
- Shadow: Grow to xl
- Duration: 250ms spring easing

**Top 10 Variant**:
- Large gradient number badge (bottom-left)
- Numbers 1-10 in 4rem font
- Gradient: purple to blue

### 5. Detail Modal
**Purpose**: Full movie/series information

**Layout**:
- Fixed overlay (z-index: 1000)
- Max-width: 900px
- Max-height: 90vh
- Scrollable content

**Structure**:
```
┌──────────────────────────────────┐
│   Backdrop Image (full-width)    │ ← 400px height
│   with gradient overlay           │
├──────────────────────────────────┤
│  [Poster]  Title                 │ ← Overlapping poster
│  (-100px)  ⭐ 8.2  IMDb 8.5      │
│            Overview text...       │
│            [Trailer iframe]       │
├──────────────────────────────────┤
│  Cast Grid (horizontal scroll)   │
└──────────────────────────────────┘
```

**Elements**:
- Close button: Top-right, rotating X on hover
- Poster: 200px wide, overlapping backdrop (-100px)
- Title: 2.5rem, bold
- Ratings: TMDb (star) + IMDb (yellow badge)
- Overview: Gray text, 1.8 line-height
- Trailer: YouTube embed, 16:9 ratio
- Cast: Horizontal scroll cards

**Animations**:
- Modal scale-in: 0.95 → 1.0, 0.3s spring
- Backdrop fade: 0.2s

### 6. Content Rows
**Purpose**: Horizontal scrolling sections

**Types**:
1. Top 10 Trending Movies
2. Top 10 Trending Series  
3. Browse by Genre (grid instead of scroll)
4. Top Rated All Time - Movies
5. Top Rated All Time - Series

**Layout**:
- Section header: Title + "See All" button
- Content: Horizontal scroll, snap points
- Gap: 1rem between cards
- Scrollbar: 6px height, rounded

**Genre Grid**:
- Grid: auto-fill, minmax(200px, 1fr)
- Cards: Icon + Name + Count
- Unique gradient per genre
- 11 categories total

---

## 🎯 Features List

### Core Features
1. **API Key Setup** ✅
   - TMDb API key validation
   - OMDb API key (optional)
   - localStorage persistence
   - Settings button to change keys

2. **Home Page** ✅
   - Hero featured movie
   - Top 10 Trending (Movies + Series)
   - Browse by Genre
   - Top Rated All Time (Movies + Series)

3. **Search** ✅
   - Real-time search
   - Debounced (300ms)
   - Search history
   - Keyboard shortcut (⌘K)

4. **Detail View** ✅
   - TMDb rating
   - IMDb rating (if OMDb key provided)
   - YouTube trailer embed
   - Cast information
   - Overview & metadata

5. **Favorites** ✅
   - Add/remove to favorites
   - localStorage persistence
   - Dedicated favorites tab
   - Toast notifications

6. **Animations** ✅
   - 60fps hardware-accelerated
   - Clapperboard intro
   - IMAX countdown (3 seconds)
   - Card hovers
   - Modal transitions
   - Tab animations

### Technical Features
1. **Smart Caching**
   - IMDb ratings cached in localStorage
   - One API call per movie (forever cached)
   - Search history (last 10)
   - Favorites persistence

2. **Performance**
   - Lazy loading images
   - Debounced search
   - Hardware-accelerated animations
   - Efficient DOM updates

3. **UX**
   - Loading states
   - Error handling
   - Toast notifications
   - Keyboard shortcuts
   - Responsive design

---

## 📡 API Integration

### TMDb API (Required)
**Base URL**: `https://api.themoviedb.org/3`

**Endpoints Used**:
```javascript
// Validation
GET /configuration?api_key={key}

// Trending
GET /trending/movie/week?api_key={key}
GET /trending/tv/week?api_key={key}

// Top Rated
GET /movie/top_rated?api_key={key}
GET /tv/top_rated?api_key={key}

// Details
GET /movie/{id}?api_key={key}&append_to_response=credits,videos
GET /tv/{id}?api_key={key}&append_to_response=credits,videos

// Search
GET /search/movie?api_key={key}&query={query}
GET /search/tv?api_key={key}&query={query}

// Images
GET https://image.tmdb.org/t/p/w500/{poster_path}
GET https://image.tmdb.org/t/p/original/{backdrop_path}
```

### OMDb API (Optional)
**Base URL**: `https://www.omdbapi.com`

**Endpoint**:
```javascript
GET /?apikey={key}&i={imdb_id}
```

**Usage Strategy**:
- Only called in detail modal
- Only when TMDb provides imdb_id
- Cached in localStorage forever
- Graceful fallback if no key

**Response Extract**:
```javascript
{
  "imdbRating": "8.5",  //← Only field we use
  "Response": "True"
}
```

---

## 📁 File Structure

```
bingebase/
├── index.html          # Main HTML structure
├── style.css           # Complete design system & styles
├── app.js              # Application logic
├── server.js           # Express server (unchanged from v1)
├── package.json        # Dependencies & scripts
├── .env.example        # Environment template
├── .gitignore          # Git exclusions
├── start.bat           # Windows launcher
└── DESIGN_SPEC.md      # This file
```

---

## 🔧 Technical Implementation

### HTML Structure
```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Meta tags -->
    <!-- Inter font from Google Fonts -->
    <!-- style.css -->
  </head>
  <body>
    <!-- Setup Page (z-index: 2000) -->
    <div class="setup-page">
      <!-- Clapperboard -->
      <!-- Form with TMDb + OMDb inputs -->
      <!-- Launch button -->
    </div>
    
    <!-- IMAX Countdown (z-index: 3000) -->
    <div class="countdown-screen">
      <!-- Film reels -->
      <!-- Countdown number -->
    </div>
    
    <!-- Main App (z-index: 1) -->
    <div class="app-container">
      <!-- Header (sticky) -->
      <header>
        <!-- Logo, Search, Settings -->
        <!-- Tabs -->
      </header>
      
      <!-- Main Content -->
      <main>
        <!-- Hero -->
        <!-- Content Rows -->
        <!-- Loading/Empty states -->
      </main>
      
      <!-- Detail Modal (z-index: 1000) -->
      <div class="modal">
        <!-- Modal content -->
      </div>
    </div>
    
    <!-- Toast Container (z-index: 2000) -->
    
    <script src="app.js"></script>
  </body>
</html>
```

### JavaScript Architecture
```javascript
// 1. Configuration
const CONFIG = {
  API_KEY: localStorage.getItem('tmdb_api_key'),
  OMDB_KEY: localStorage.getItem('omdb_api_key'),
  API_BASE: 'https://api.themoviedb.org/3',
  OMDB_BASE: 'https://www.omdbapi.com',
  IMAGE_BASE: 'https://image.tmdb.org/t/p',
  POSTER: 'w500',
  BACKDROP: 'original'
};

// 2. State Management
const state = {
  currentTab: 'home',
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  searchHistory: JSON.parse(localStorage.getItem('search_history')) || [],
  imdbCache: JSON.parse(localStorage.getItem('imdb_cache')) || {}
};

// 3. DOM Elements
const el = { /* All element references */ };

// 4. Setup Functions
function showSetupPage() { }
function validateTMDb(key) { }
function hideSetup() { }

// 5. Countdown Functions
function showCountdown() { }

// 6. API Functions
async function api(endpoint, params) { }
async function getTrending(type) { }
async function getTopRated(type) { }
async function getDetails(id, type) { }
async function getIMDb(imdbId) { }

// 7. Render Functions
function createCard(item, showNumber, number) { }
function renderRow(container, items, showNumbers) { }

// 8. Content Loading
async function loadHome() { }
async function loadGenres() { }
function loadHero(item) { }

// 9. Detail Modal
async function showDetails(id, type) { }
function closeModal() { }

// 10. Event Listeners
// Tabs, Search, Settings, Keyboard

// 11. Initialization
function init() { }
init(); // or showSetupPage()
```

### CSS Organization
```css
/* 1. Design System Variables */
:root { /* All CSS custom properties */ }

/* 2. Base Styles */
*, body, scrollbar

/* 3. Setup Page */
.setup-page, .clapperboard, inputs, buttons

/* 4. IMAX Countdown */
.countdown-screen, .reel-circle, animations

/* 5. App Container */
.app-container

/* 6. Header */
.header, .logo, .search, .tabs

/* 7. Main Content */
.main-content, .hero, .content-row

/* 8. Movie Cards */
.movie-card, .number-badge

/* 9. States */
.loading-state, .empty-state

/* 10. Modal */
.modal, .modal-content

/* 11. Toast */
.toast-container

/* 12. Responsive */
@media queries
```

---

## 🎬 User Flows

### First Time User
1. App loads → Setup page appears
2. User sees clapperboard animation
3. User enters TMDb API key (required)
4. User optionally enters OMDb API key
5. Click "Launch Experience"
6. Validation happens
7. 3-second IMAX countdown plays
8. Main app fades in
9. Home page loads with content

### Returning User
1. App loads → Keys exist in localStorage
2. Countdown plays immediately
3. Main app loads

### Browsing
1. Home tab shows curated sections
2. Scroll horizontally through rows
3. Click movie → Detail modal opens
4. See ratings, trailer, cast
5. Close modal → Back to browsing

### Searching
1. Click search / Press ⌘K
2. Type query (debounced 300ms)
3. Results appear in real-time
4. Click result → Detail modal

### Changing Keys
1. Click settings gear icon
2. Confirm dialog
3. Keys cleared  
4. Page reloads → Setup page

---

## 🎨 Icon System

**Library**: Lucide Icons (via inline SVG)  
**Stroke Width**: 2px  
**Sizes**: 18px (tabs), 20px (inputs), 24px (features), 80px (logo)

**Icons Used**:
- Film: Movie/cinema representation
- Home: Home tab
- TV: Series tab
- Heart: Favorites
- Search: Search function
- Settings: Settings gear
- Lock: TMDb API key
- Star: Ratings, OMDb key
- Play: Trailers
- X: Close modal
- Arrow Right: Navigation

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",    // Server
    "dotenv": "^16.3.1",      // Environment vars
    "open": "^10.0.0"         // Auto-open browser
  }
}
```

---

## 🚀 Build Instructions

### Quick Start
```bash
npm install
npm start
```

### Manual Build
1. Create files: index.html, style.css, app.js
2. Copy all code from specification
3. Run server: `node server.js`
4. Open: `http://localhost:3000`

### Environment
- Node.js >= 14.0.0
- Modern browser with ES6+ support
- Internet connection (APIs)

---

## ✅ Quality Checklist

### Visual
- ✅ Consistent color palette
- ✅ Perfect typography hierarchy
- ✅ Proper spacing rhythm
- ✅ Beautiful modern icons
- ✅ Smooth 60fps animations
- ✅ Proper shadows & depth

### UX
- ✅ Fast page loads
- ✅ Instant feedback
- ✅ Clear loading states
- ✅ Helpful error messages
- ✅ Keyboard navigation
- ✅ Mobile responsive

### Code
- ✅ No console errors
- ✅ Clean code structure
- ✅ Optimized performance
- ✅ Best practices
- ✅ Production ready

---

## 🎯 Future Enhancements

### Possible Additions
- User accounts & watchlists
- Social sharing
- Video player integration
- Recommendations engine
- Multiple language support
- Dark/light theme toggle
- Advanced filters
- Sorting options
- Infinite scroll
- Skeleton loaders
- Better empty states
- More animations

---

## 📝 Notes

### Key Design Decisions
1. **Minified CSS**: For production performance
2. **Inline SVGs**: Better control & performance than icon fonts
3. **localStorage**: No backend database needed
4. **Vanilla JS**: No framework overhead
5. **Hardware Acceleration**: transform & opacity only
6. **Smart Caching**: Minimize API calls

### Performance Tips
- Use `will-change` sparingly
- Lazy load images
- Debounce expensive operations
- Cache API responses
- Minimize reflows/repaints

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-21  
**Author**: BingeBase Development Team  

---

*End of Design Specification*
