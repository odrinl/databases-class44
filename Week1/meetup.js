const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  port: 3306,
  user     : 'hyfuser',
  password : 'hyfpassword',
  multipleStatements: true,  
});

const databaseName = 'meetup';

// Function to drop and create the database
const recreateDatabase = () => {
  const dropDatabaseQuery = `DROP DATABASE IF EXISTS ${databaseName};`; 
const createDatabaseQuery = `CREATE DATABASE ${databaseName};`; 
  
  connection.query(dropDatabaseQuery + createDatabaseQuery, (err, results) => {
    if (err) {
      console.error('Error recreating the database:', err);
      connection.end();
    } else {
      console.log(`Database "${databaseName}" dropped and recreated.`);
      // Switch to the newly created database
      connection.changeUser({ database: databaseName }); 
      // Call the function to create tables
      createTables(); 
    }
  });
};

const createTables = () => {
const createInviteeTable = `
  CREATE TABLE Invitee (
    invitee_no INT AUTO_INCREMENT PRIMARY KEY,
    invitee_name VARCHAR(255) NOT NULL,
    invited_by VARCHAR(255)
  );
`;

const createRoomTable = `
  CREATE TABLE Room (
    room_no INT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    floor_number INT
  );
`;

const createMeetingTable = `
  CREATE TABLE Meeting (
    meeting_no INT AUTO_INCREMENT PRIMARY KEY,
    meeting_title VARCHAR(255) NOT NULL,
    starting_time DATETIME NOT NULL,
    ending_time DATETIME NOT NULL,
    room_no INT,
    FOREIGN KEY (room_no) REFERENCES Room(room_no)
  );
`;

// Execute the table creation queries
connection.query(createInviteeTable + createRoomTable + createMeetingTable, (err, results) => {
  if (err) {
    console.error('Error creating tables:', err);
  } else {
    console.log('Tables created successfully.');
    insertSampleData(); 
  }
});
};

// Function to insert data
const insertSampleData = () => {

  const insertInviteeData = `
    INSERT INTO Invitee (invitee_name) VALUES
      ('Jan de Vries'),
      ('Marieke Jansen'),
      ('Pieter Bakker'),
      ('Laura Smit'),
      ('Erik Jacobs');
  `;

  const insertRoomData = `
    INSERT INTO Room (room_name, floor_number) VALUES
      ('Boardroom A', 5),
      ('Executive Suite', 8),
      ('Innovation Lab', 1),
      ('Training Room C', 2),
      ('Conference Room X', 10);
  `;

  const insertMeetingData = `
    INSERT INTO Meeting (meeting_title, starting_time, ending_time, room_no) VALUES
      ('Product Launch Planning', '2023-08-21 09:00:00', '2023-08-21 10:30:00', 1),
      ('Development Team Meeting', '2023-08-22 14:00:00', '2023-08-22 15:30:00', 2),
      ('Employee Training Session', '2023-08-23 11:00:00', '2023-08-23 13:00:00', 3),
      ('Executive Board Meeting', '2023-08-24 15:30:00', '2023-08-24 17:00:00', 2),
      ('Strategic Planning Discussion', '2023-08-25 10:30:00', '2023-08-25 12:00:00', 1);
  `;
// Execute the insert queries
connection.query(insertInviteeData + insertRoomData + insertMeetingData, (err, results) => {
  if (err) {
    console.error('Error inserting sample data:', err);
  } else {
    console.log('Sample data inserted successfully.');
  }
  connection.end();
});
};

// Call the function to drop and recreate the database
recreateDatabase();