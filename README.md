# 🎬 BingeBase

> Your premium cinema universe - A beautiful movie & TV series search app with liquid glass UI

![BingeBase](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎨 Premium UI/UX
- **Liquid glass morphism** - Transparent, frosted glass effects
- **Apple TV-inspired design** - Card-based layout with smooth animations  
- **Ultra-smooth 60fps animations** - Buttery transitions
- **Tab navigation** - Movies / TV Shows / My Favorites
- **Responsive** - Works beautifully on all devices

### 🔍 Smart Search & Discovery
- ⚡ **Instant search** - Results as you type
- 📜 **Search history** - Quick access to recent searches
- 🤖 **Smart recommendations** - Based on your search patterns
- 👤 **Actor-based sorting** - Find all movies by an actor
- 🎭 **Genre filtering** - Browse by category

### 💎 Advanced Features
- ⭐ **Multiple ratings** - IMDb, TMDb, Rotten Tomatoes
- 💾 **Favorites tab** - Your personal collection
- 📺 **Streaming availability** - See where to watch
- 🎥 **Inline trailers** - Watch without leaving the app
- 👥 **Cast exploration** - Click any actor to see their filmography
- ⌨️ **Keyboard shortcuts** - `Cmd/Ctrl + K` to search

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed ([Download here](https://nodejs.org/))
- TMDb API key ([Get free here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kalyanreddy1009/bingebase.git
   cd bingebase
   ```

2. **Set up your API key**
   - Copy `.env.example` to `.env`
   - Add your TMDb API key:
     ```
     TMDB_API_KEY=your_api_key_here
     ```

3. **Start the app** (one command!)
   ```bash
   npm start
   ```
   
   Or on Windows, just double-click `start.bat`

The app will automatically:
- Install dependencies (if needed)
- Start the server on port 3000
- Open your browser

## 🎯 Usage

- **Search**: Type in the search bar or press `Cmd/Ctrl + K`
- **Switch tabs**: Click Movies, TV Shows, or My Favorites
- **View details**: Click any content card
- **Add to favorites**: Click the heart icon
- **Explore cast**: Click any actor in the detail view
- **Close modal**: Click X or press `Esc`

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Liquid Glass Design), Vanilla JavaScript
- **Backend**: Node.js + Express
- **API**: TMDb (The Movie Database)
- **Fonts**: Inter (Google Fonts)

## 📁 Project Structure

```
bingebase/
├── index.html          # Main HTML structure
├── style.css           # Liquid glass design system
├── app.js              # Core application logic
├── server.js           # Express server
├── package.json        # Dependencies
├── start.bat           # Windows one-click launcher
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🎨 Design Philosophy

BingeBase follows an **Apple TV-inspired** design language with:
- **Liquid glass effects** for depth and premium feel
- **Generous spacing** and breathing room
- **Smooth micro-animations** for engagement
- **Dark theme** optimized for content consumption
- **Focus on content** with minimal UI clutter

## 🔑 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Focus search bar |
| `Esc` | Close modal |

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

- **TMDb** for providing the amazing movie database API
- **Google Fonts** for the beautiful Inter typeface
- Movie data and images courtesy of [The Movie Database (TMDb)](https://www.themoviedb.org/)

---

**Made with ❤️ for movie lovers**

*BingeBase - Better than Google search for movies & TV shows*
