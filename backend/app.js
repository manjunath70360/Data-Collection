const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors')

const app = express();
const port = 3000;

app.use(cors())

// SQLite database connection
const db = new sqlite3.Database('./database.sqlite');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create User table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`);

// Create Address table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS Address (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    address TEXT,
    FOREIGN KEY (userId) REFERENCES User(id)
  )
`);

// Route to handle form submission
app.post('/users/create', (req, res) => {
  const { name, address } = req.body;

  db.run(`INSERT INTO User (name) VALUES (?)`, [name], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const userId = this.lastID; 

    db.run(`INSERT INTO Address (userId, address) VALUES (?, ?)`, [userId, address], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: 'User and Address created successfully',
        userId: userId,
        addressId: this.lastID
      });
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
