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

// Create the research_Papers table
db.query(`
  CREATE TABLE IF NOT EXISTS research_Papers (
    paper_id INT AUTO_INCREMENT PRIMARY KEY,
    paper_title VARCHAR(255),
    conference VARCHAR(255),
    publish_date DATE
  )
`, (err, result) => {
  if (err) {
    console.error('Error creating research_Papers table:', err);
  } else {
    console.log('Research_Papers table created');
  }
});

// Create a table to represent the relationship between authors and research papers
db.query(`
  CREATE TABLE IF NOT EXISTS author_paper (
    author_id INT,
    paper_id INT,
    FOREIGN KEY (author_id) REFERENCES authors(author_id),
    FOREIGN KEY (paper_id) REFERENCES research_Papers(paper_id)
  )
`, (err, result) => {
  if (err) {
    console.error('Error creating author_paper table:', err);
  } else {
    console.log('Author_paper table created');
  }
});

// Insert data for 15 authors
db.query(`
INSERT INTO authors (author_name, university, date_of_birth, h_index, gender, mentor)
VALUES
    ('Author 1', 'University A', '1990-01-01', 10, 'Male', NULL),
    ('Author 2', 'University B', '1991-02-02', 8, 'Female', NULL),
    ('Author 3', 'University A', '1992-03-03', 6, 'Male', 1),
    ('Author 4', 'University C', '1993-04-04', 9, 'Female', 2),
    ('Author 5', 'University B', '1994-05-05', 7, 'Male', 1),
    ('Author 6', 'University A', '1995-06-06', 5, 'Female', 3),
    ('Author 7', 'University C', '1996-07-07', 8, 'Male', 2),
    ('Author 8', 'University A', '1997-08-08', 6, 'Female', 4),
    ('Author 9', 'University B', '1998-09-09', 7, 'Male', 3),
    ('Author 10', 'University C', '1999-10-10', 8, 'Female', 5),
    ('Author 11', 'University A', '2000-11-11', 9, 'Male', 6),
    ('Author 12', 'University B', '2001-12-12', 10, 'Female', 7),
    ('Author 13', 'University C', '2002-01-13', 8, 'Male', 8),
    ('Author 14', 'University A', '2003-02-14', 7, 'Female', 9),
    ('Author 15', 'University B', '2004-03-15', 6, 'Male', 10);
`, (err, result) => {
  if (err) {
    console.error('Error inserting data for authors:', err);
  } else {
    console.log('Data inserted successfully for authors');
  }
});

// Insert data for 30 research papers
db.query(`
INSERT INTO research_papers (paper_title, conference, publish_date)
VALUES
    ('Paper 1', 'Conference A', '2022-01-01'),
    ('Paper 2', 'Conference B', '2022-02-01'),
    ('Paper 3', 'Conference A', '2022-03-01'),
    ('Paper 4', 'Conference C', '2022-04-01'),
    ('Paper 5', 'Conference B', '2022-05-01'),
    ('Paper 6', 'Conference A', '2022-06-01'),
    ('Paper 7', 'Conference C', '2022-07-01'),
    ('Paper 8', 'Conference A', '2022-08-01'),
    ('Paper 9', 'Conference B', '2022-09-01'),
    ('Paper 10', 'Conference C', '2022-10-01'),
    ('Paper 11', 'Conference A', '2022-11-01'),
    ('Paper 12', 'Conference B', '2022-12-01'),
    ('Paper 13', 'Conference C', '2023-01-01'),
    ('Paper 14', 'Conference A', '2023-02-01'),
    ('Paper 15', 'Conference B', '2023-03-01'),
    ('Paper 16', 'Conference C', '2023-04-01'),
    ('Paper 17', 'Conference A', '2023-05-01'),
    ('Paper 18', 'Conference B', '2023-06-01'),
    ('Paper 19', 'Conference C', '2023-07-01'),
    ('Paper 20', 'Conference A', '2023-08-01'),
    ('Paper 21', 'Conference B', '2023-09-01'),
    ('Paper 22', 'Conference C', '2023-10-01'),
    ('Paper 23', 'Conference A', '2023-11-01'),
    ('Paper 24', 'Conference B', '2023-12-01'),
    ('Paper 25', 'Conference C', '2024-01-01'),
    ('Paper 26', 'Conference A', '2024-02-01'),
    ('Paper 27', 'Conference B', '2024-03-01'),
    ('Paper 28', 'Conference C', '2024-04-01'),
    ('Paper 29', 'Conference A', '2024-05-01'),
    ('Paper 30', 'Conference B', '2024-06-01');
`, (err, result) => {
  if (err) {
    console.error('Error inserting data for research papers:', err);
  } else {
    console.log('Data inserted successfully for research papers');
  }
});

// Insert data into the author_paper table to associate authors with research papers
db.query(`
  INSERT INTO author_paper (author_id, paper_id)
  VALUES
      (1, 1),
      (2, 2),
      (3, 3),
      (4, 4),
      (5, 5),
      (6, 6),
      (7, 7),
      (8, 8),
      (9, 9),
      (10, 10),
      (11, 11),
      (12, 12),
      (13, 13),
      (14, 14),
      (15, 15),
      (1, 16),
      (2, 17),
      (3, 18),
      (4, 19),
      (5, 20),
      (6, 21),
      (7, 22),
      (8, 23),
      (9, 24),
      (10, 25),
      (11, 26),
      (12, 27),
      (13, 28),
      (14, 29),
      (15, 30),
      (10, 1),
      (12, 2),
      (13, 3),
      (14, 4),
      (15, 5),
      (2, 6),
      (3, 7),
      (4, 8),
      (5, 9);
`, (err, result) => {
  if (err) {
    console.error('Error inserting data into author_paper:', err);
  } else {
    console.log('Data inserted successfully into author_paper');
  }
});


// Close the database connection
db.end();