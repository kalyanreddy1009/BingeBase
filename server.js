// BingeBase Server - Express Static File Server
const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const open = require('open');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🎬 BingeBase IMAX Edition`);
    console.log(`═══════════════════════════════════`);
    console.log(`✓ Server running at: http://localhost:${PORT}`);
    console.log(`✓ Press Ctrl+C to stop\n`);

    // Auto-open browser
    setTimeout(() => {
        open(`http://localhost:${PORT}`);
    }, 1000);
});
