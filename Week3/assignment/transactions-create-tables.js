const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'hyfuser',
  password: 'hyfpassword',
});

const databaseName = 'transactions';  

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Create the database (replace 'your_database_name' with your desired database name)
db.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Database "${databaseName}" created or already exists.`);
});

// Use the created database
db.query(`USE ${databaseName}`, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Using database "${databaseName}".`);
});

// Create the account table
db.query(`
  CREATE TABLE IF NOT EXISTS account (
    account_number INT PRIMARY KEY,
    balance DECIMAL(10, 2) NOT NULL
  )
`);

// Create the account_changes table
db.query(`
  CREATE TABLE IF NOT EXISTS account_changes (
    change_number INT AUTO_INCREMENT PRIMARY KEY,
    account_number INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remark TEXT,
    FOREIGN KEY (account_number) REFERENCES account(account_number)
  )
`);

// Close the database connection
db.end((err) => {
  if (err) {
    console.error('Error closing the database connection: ' + err.stack);
    return;
  }
  console.log('Closed the database connection');
});
