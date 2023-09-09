const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'world',
});

const queries = [
  {
    description: 'Countries with population greater than 8 million',
    query: 'SELECT Name FROM country WHERE Population > 8000000',
  },
  {
    description: 'Countries with "land" in their names',
    query: 'SELECT Name FROM country WHERE Name LIKE "%land%"',
  },
  {
    description: 'Cities with population between 500,000 and 1 million',
    query: 'SELECT Name FROM city WHERE Population BETWEEN 500000 AND 1000000',
  },
  {
    description: 'Countries in Europe',
    query: 'SELECT Name FROM country WHERE Continent = "Europe"',
  },
  {
    description: 'Countries in descending order of surface area',
    query: 'SELECT Name FROM country ORDER BY SurfaceArea DESC',
  },
  {
    description: 'Cities in the Netherlands',
    query: 'SELECT Name FROM city WHERE CountryCode = "NLD"',
  },
  {
    description: 'Population of Rotterdam',
    query: 'SELECT Population FROM city WHERE Name = "Rotterdam"',
  },
  {
    description: 'Top 10 countries by Surface Area',
    query: 'SELECT Name, SurfaceArea FROM country ORDER BY SurfaceArea DESC LIMIT 10',
  },
  {
    description: 'Top 10 most populated cities',
    query: 'SELECT Name, Population FROM city ORDER BY Population DESC LIMIT 10',
  },
  {
    description: 'Population number of the world',
    query: 'SELECT SUM(Population) as TotalPopulation FROM country',
  },
];

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');

  // Loop through the queries
  queries.forEach((queryObj, index) => {
    connection.query(queryObj.query, (err, results) => {
      if (err) throw err;
      console.log(queryObj.description);
      if (results.length > 0) {
        results.forEach((row) => {
          console.log(row.Name || row.Population || row.TotalPopulation);
        });
      } else {
        console.log('No results found');
      }
      console.log('\n');

      // Close the database connection after the last query
      if (index === queries.length - 1) {
        connection.end((err) => {
          if (err) {
            console.error('Error closing the database connection: ' + err.stack);
            return;
          }
          console.log('Closed the database connection');
        });
      }
    });
  });
});
