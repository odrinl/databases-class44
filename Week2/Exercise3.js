const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'paper',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Generic function to handle query results and errors
function handleQueryResult(err, results, message) {
  if (err) {
    console.error(`Error executing query (${message}):`, err);
  } else {
    console.log(message);
    results.forEach((row) => {
      console.log(row);
    });
  }
}

// Query to print names of all authors and their mentors
db.query(
  `
  SELECT
  a.author_name AS author_name,
  m.author_name AS mentor_name
FROM
  authors a
LEFT JOIN
  authors m ON a.mentor = m.author_id;

`,
  (err, results) => {
    handleQueryResult(err, results, '\nAuthors and Their Mentors:');
  }
);

// Query to print all columns of authors and their published paper titles
db.query(
  `
  SELECT a.*, GROUP_CONCAT(p.paper_title) AS published_papers
  FROM authors a
  LEFT JOIN author_paper ap ON a.author_id = ap.author_id
  LEFT JOIN research_Papers p ON ap.paper_id = p.paper_id
  GROUP BY a.author_id
  `,
  (err, results) => {
    handleQueryResult(err, results, '\nAuthors and Their Published Papers:');
  }
);

// Close the database connection
db.end();
