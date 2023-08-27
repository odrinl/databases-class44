const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'papers',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

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
    if (err) {
      console.error('Error executing query:', err);
    } else {
      console.log('\nAuthors and Their Mentors:');
      results.forEach((row) => {
        console.log(
          `Author: ${row.author_name}, Mentor: ${row.mentor_name || 'N/A'}`
        );
      });
    }
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
    if (err) {
      console.error('Error executing query:', err);
    } else {
      console.log('\nAuthors and Their Published Papers:');
      results.forEach((row) => {
        // Add a space after each comma in published_papers
        const formattedPapers = row.published_papers.replace(/,/g, ', ');
        // Format the date_of_birth using JavaScript
        const formattedDate = row.date_of_birth.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        console.log(
          `author_id: ${row.author_id}, author_name: ${row.author_name}, university: ${row.university}, date_of_birth: ${formattedDate}, h_index: ${row.h_index}, gender: ${row.gender}, mentor: ${row.mentor}`
        );
        console.log(`published_papers: ${formattedPapers}.\n`);

      });
    }
  }
);

// Close the database connection
db.end();
