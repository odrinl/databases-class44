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
  }
  console.log('Connected to MySQL database');
});

/// Query to retrieve all research papers and the number of authors for each paper
db.query(
  `
SELECT rp.paper_title, COUNT(*) AS num_authors
FROM research_Papers rp
JOIN author_paper ap ON rp.paper_id = ap.paper_id
GROUP BY rp.paper_title
`,
  (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
    }

    console.log('\nResearch Papers and Number of Authors:');
    results.forEach((row) => {
      console.log(
        `Paper Title: ${row.paper_title}, Number of Authors: ${row.num_authors}`
      );
    });
  }
);

// Query to calculate the sum of research papers published by all female authors
db.query(
  `SELECT COUNT(DISTINCT p.paper_title) AS total_papers_by_female_authors
  FROM authors a
  INNER JOIN author_paper ap ON a.author_id = ap.author_id
  INNER JOIN research_Papers p ON ap.paper_id = p.paper_id
  WHERE a.gender = 'F'
`,
  (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
    }

    console.log('\nSum of Research Papers by Female Authors:');
    console.log(
      `Total Papers: ${results[0].total_papers_by_female_authors || 0}`
    );
  }
);

// Query to calculate the average h-index of all authors per university
db.query(
  `
  SELECT university, AVG(h_index) AS avg_h_index
  FROM authors
  GROUP BY university
`,
  (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
    }

    console.log('\nAverage H-Index of Authors per University:');
    results.forEach((row) => {
      console.log(
        `University: ${row.university}, Average H-Index: ${row.avg_h_index}`
      );
    });
  }
);

// Query to calculate the sum of research papers by authors per university
db.query(
  `
  SELECT a.university, COUNT(DISTINCT ap.paper_id) AS total_papers_by_university
  FROM author_paper ap
  JOIN authors a ON ap.author_id = a.author_id
  GROUP BY a.university
`,
  (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
    }

    console.log('\nTotal Research Papers by University:');
    results.forEach((row) => {
      console.log(
        `University: ${row.university}, Total Papers: ${
          row.total_papers_by_university || 0
        }`
      );
    });
  }
);

// Query to find the minimum and maximum h-index of authors per university
db.query(
  `
  SELECT university, MIN(h_index) AS min_h_index, MAX(h_index) AS max_h_index
  FROM authors
  GROUP BY university
`,
  (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
    }

    console.log('\nMinimum and Maximum H-Index of Authors per University:');
    results.forEach((row) => {
      console.log(
        `University: ${row.university}, Min H-Index: ${
          row.min_h_index || 'N/A'
        }, Max H-Index: ${row.max_h_index || 'N/A'}`
      );
    });
  }
);

// Close the database connection
db.end();
