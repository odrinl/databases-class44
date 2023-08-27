const mysql = require('mysql');

const db = mysql.createConnection({
  host     : 'localhost',
  port: 3306,
  user     : 'hyfuser',
  password : 'hyfpassword',
  database : 'papers',
  
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create the authors table
db.query(`
  CREATE TABLE IF NOT EXISTS authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(255),
    university VARCHAR(255),
    date_of_birth DATE,
    h_index INT,
    gender VARCHAR(10)
  )
`, (err, result) => {
  if (err) {
    console.error('Error creating authors table:', err);
  } else {
    console.log('Authors table created');
  }
});

// Add the mentor column with a foreign key constraint
db.query(`
  ALTER TABLE authors
  ADD COLUMN mentor INT,
  ADD FOREIGN KEY (mentor) REFERENCES authors(author_id)
`, (err, result) => {
  if (err) {
    console.error('Error adding mentor column:', err);
  } else {
    console.log('Mentor column added');
  }
});

// Close the database connection
db.end();