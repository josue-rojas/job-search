// Not used anymore. i used this to seed some initial data to test out the db
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database file
const dbPath = path.join(__dirname, 'jobs.db');

// Array of job links to add
const jobs = require('./seen')

// Open a connection to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Prepare the SQL statement to insert data into the jobs table
const insertStmt = db.prepare('INSERT INTO jobs (link, datePosted) VALUES (?, ?)');

// Insert each job link into the jobs table
jobs.forEach(link => {
  const datePosted = new Date().toISOString(); // Format the current date and time
  insertStmt.run(link, datePosted, (err) => {
    if (err) {
      console.error('Error inserting data:', err.message);
    } else {
      console.log(`Inserted link: ${link}`);
    }
  });
});

// Finalize the statement and close the database connection
insertStmt.finalize((err) => {
  if (err) {
    console.error('Error finalizing statement:', err.message);
  } else {
    console.log('Statement finalized.');
  }
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});
