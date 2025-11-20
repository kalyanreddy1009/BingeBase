const express = require('express');
const path = require('path');
const fs = require('fs');
const open = require('open');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Inject API key into app.js
app.get('/app.js', (req, res) => {
    const filePath = path.join(__dirname, 'app.js');
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace placeholder with actual API key from environment
    const apiKey = process.env.TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
    content = content.replace('YOUR_TMDB_API_KEY', apiKey);

    res.type('application/javascript');
    res.send(content);
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, async () => {
    console.log('');
    console.log('🎬 ================================');
    console.log('   BingeBase is running!');
    console.log('================================ 🎬');
    console.log('');
    console.log(`📍 Local:   http://localhost:${PORT}`);
    console.log('');

    if (!process.env.TMDB_API_KEY || process.env.TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
        console.log('⚠️  WARNING: TMDb API key not set!');
        console.log('   Please add your API key to the .env file');
        console.log('   Get a free key at: https://www.themoviedb.org/settings/api');
        console.log('');
    }

    console.log('Press Ctrl+C to stop the server');
    console.log('');

    // Auto-open browser
    try {
        await open(`http://localhost:${PORT}`);
        console.log('✅ Browser opened automatically');
    } catch (err) {
        console.log('ℹ️  Please open http://localhost:' + PORT + ' in your browser');
    }
});
