const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'transactions', 
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Insert sample data into the account table
db.query('INSERT INTO account (account_number, balance) VALUES (12345, 5000)');
db.query('INSERT INTO account (account_number, balance) VALUES (12346, 3000)');

// Close the database connection
db.end((err) => {
  if (err) {
    console.error('Error closing the database connection: ' + err.stack);
    return;
  }
  console.log('Closed the database connection');
});
