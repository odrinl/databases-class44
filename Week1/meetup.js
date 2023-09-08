const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'hyfuser',
  password: 'hyfpassword',
  multipleStatements: true,
});

const databaseName = 'meetup';

const queries = [
  `DROP DATABASE IF EXISTS ${databaseName};`,
  `CREATE DATABASE ${databaseName};`,
  `USE ${databaseName};`,
  `
  CREATE TABLE Invitee (
    invitee_no INT AUTO_INCREMENT PRIMARY KEY,
    invitee_name VARCHAR(255) NOT NULL,
    invited_by VARCHAR(255)
  );
  `,
  `
  CREATE TABLE Room (
    room_no INT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    floor_number TINYINT
  );
  `,
  `
  CREATE TABLE Meeting (
    meeting_no INT AUTO_INCREMENT PRIMARY KEY,
    meeting_title VARCHAR(255) NOT NULL,
    starting_time DATETIME NOT NULL,
    ending_time DATETIME NOT NULL,
    room_no INT,
    FOREIGN KEY (room_no) REFERENCES Room(room_no)
  );
  `,
  `
  INSERT INTO Invitee (invitee_name) VALUES
    ('Jan de Vries'),
    ('Marieke Jansen'),
    ('Pieter Bakker'),
    ('Laura Smit'),
    ('Erik Jacobs');
  `,
  `
  INSERT INTO Room (room_name, floor_number) VALUES
    ('Boardroom A', 5),
    ('Executive Suite', 8),
    ('Innovation Lab', 1),
    ('Training Room C', 2),
    ('Conference Room X', 10);
  `,
  `
  INSERT INTO Meeting (meeting_title, starting_time, ending_time, room_no) VALUES
    ('Product Launch Planning', '2023-08-21 09:00:00', '2023-08-21 10:30:00', 1),
    ('Development Team Meeting', '2023-08-22 14:00:00', '2023-08-22 15:30:00', 2),
    ('Employee Training Session', '2023-08-23 11:00:00', '2023-08-23 13:00:00', 3),
    ('Executive Board Meeting', '2023-08-24 15:30:00', '2023-08-24 17:00:00', 2),
    ('Strategic Planning Discussion', '2023-08-25 10:30:00', '2023-08-25 12:00:00', 1);
  `,
];

const executeQueries = (index) => {
  if (index === queries.length) {
    console.log('All queries executed successfully.');
    connection.end();
    return;
  }

  connection.query(queries[index], (err) => {
    if (err) {
      console.error(`Error executing query ${index}:`, err);
      connection.end();
      return;
    }

    console.log(`Query ${index} executed successfully.`);
    executeQueries(index + 1);
  });
};

// Function to drop and create the database
const recreateDatabase = () => {
  executeQueries(0);
};

// Call the function to drop and recreate the database
recreateDatabase();
