// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create the users table
db.serialize(() => {
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            score INTEGER NOT NULL
        )
    `);
});

// Route to handle score submission
app.post('/submit-score', (req, res) => {
    const { name, score } = req.body;
    if (!name || score === undefined) {
        return res.status(400).send('Invalid data');
    }
    
    db.run('INSERT INTO users (name, score) VALUES (?, ?)', [name, score], function(err) {
        if (err) {
            return res.status(500).send('Database error');
        }
        res.send('Score submitted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
