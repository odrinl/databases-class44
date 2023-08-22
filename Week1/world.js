const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'world', 
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Query 1: Names of countries with population greater than 8 million
connection.query(
  'SELECT Name FROM country WHERE Population > 8000000',
  (err, results) => {
    if (err) throw err;
    console.log('Countries with population greater than 8 million:');
    results.forEach((row) => {
      console.log(row.Name);
    });
    console.log('\n');
  }
);

// Query 2: Names of countries that have "land" in their names
connection.query(
  'SELECT Name FROM country WHERE Name LIKE "%land%"',
  (err, results) => {
    if (err) throw err;
    console.log('Countries with "land" in their names:');
    results.forEach((row) => {
      console.log(row.Name);
    });
    console.log('\n');
  }
);

// Query 3: Names of the cities with population between 500,000 and 1 million
connection.query(
  'SELECT Name FROM city WHERE Population BETWEEN 500000 AND 1000000',
  (err, results) => {
    if (err) throw err;
    console.log('Cities with population between 500,000 and 1 million:');
    results.forEach((row) => {
      console.log(row.Name);
    });
    console.log('\n');
  }
);

// Query 4: Names of all the countries in Europe
connection.query(
  'SELECT Name FROM country WHERE Continent = "Europe"',
  (err, results) => {
    if (err) throw err;
    console.log('Countries in Europe:');
    results.forEach((row) => {
      console.log(row.Name);
    });
    console.log('\n');
  }
);

// Query 5: List all the countries in descending order of their surface areas
connection.query(
  'SELECT Name FROM country ORDER BY SurfaceArea DESC',
  (err, results) => {
    if (err) throw err;
    console.log('Countries in descending order of surface area:');
    results.forEach((row) => {
      console.log(row.Name);
    });
    console.log('\n');
  }
);

// Query 6: Names of all the cities in the Netherlands
connection.query(
  'SELECT Name FROM city WHERE CountryCode = "NLD"',
  (err, results) => {
    if (err) throw err;
    console.log('Cities in the Netherlands:');
    results.forEach((row) => {
      console.log(row.Name);
    });
    console.log('\n');
  }
);

// Query 7: Population of Rotterdam
connection.query(
  'SELECT Population FROM city WHERE Name = "Rotterdam"',
  (err, results) => {
    if (err) throw err;
    console.log('Population of Rotterdam:');
    if (results.length > 0) {
      console.log(results[0].Population);
    } else {
      console.log('City not found');
    }
    console.log('\n');
  }
);

// Query 8: Top 10 countries by Surface Area
connection.query(
  'SELECT Name, SurfaceArea FROM country ORDER BY SurfaceArea DESC LIMIT 10',
  (err, results) => {
    if (err) throw err;
    console.log('Top 10 countries by surface area:');
    results.forEach((row, index) => {
      console.log(`${index + 1}. ${row.Name} - ${row.SurfaceArea}`);
    });
    console.log('\n');
  }
);

// Query 9: Top 10 most populated cities
connection.query(
  'SELECT Name, Population FROM city ORDER BY Population DESC LIMIT 10',
  (err, results) => {
    if (err) throw err;
    console.log('Top 10 most populated cities:');
    results.forEach((row, index) => {
      console.log(`${index + 1}. ${row.Name} - ${row.Population}`);
    });
    console.log('\n');
  }
);

// Query 10: Population number of the world
connection.query('SELECT SUM(Population) as TotalPopulation FROM country', (err, results) => {
  if (err) throw err;
  console.log('Population number of the world:');
  console.log(results[0].TotalPopulation);
  console.log('\n');
});

// Close the database connection
connection.end((err) => {
  if (err) {
    console.error('Error closing the database connection: ' + err.stack);
    return;
  }
  console.log('Closed the database connection');
});
