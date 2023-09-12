const { MongoClient } = require('mongodb');
// Load environment variables from .env file
require('dotenv').config(); 

const uri = process.env.MONGODB_URL;


const dbName = 'databaseWeek4';

async function main() {

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        // Print the total population (M + F over all age groups) for a given Country per year
        await getTotalPopulationOfCountryPerYear(client, "Netherlands");

        // Print all the information of each continent for a given Year and Age field with new field TotalPopulation that is the addition of M and F
        await getContinentInformationForYearAndAge(client, 2020, "100+");

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

/**
 * Print the total population (M + F over all age groups) for a given Country per year
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the country population data
 * @param {String} country The given country 
 */
async function getTotalPopulationOfCountryPerYear(client, country) {
    const pipeline = [
        
            {
              '$match': { 
                'Country': country
              }
            }, {
              '$group': {
                '_id': '$Year',  
                'countPopulation': {
                  '$sum': {
                    '$add': [
                      '$M', '$F'
                    ]
                  }
                }
              }
            }, {
              '$sort': {
                '_id': 1
              }
            }];
   
    const aggResults = client.db(dbName).collection("country_population").aggregate(pipeline);
    console.log(`Total population of ${country} per year: \n`);
    await aggResults.forEach(result => {
        console.log(result);
    });
}   


/**
 * Print all the information of each continent for a given Year and Age field with new field TotalPopulation that is the addition of M and F
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the country population data
 * @param {String} year The given year
 * @param {String} age The given age group
 */
async function getContinentInformationForYearAndAge(client, year, age) {
    const pipeline = [
        {
          '$match': {
            'Country': {
              '$regex': new RegExp('^[A-Z\\s]+$'), 
              '$ne': 'WORLD'
            }
          }
        }, {
          '$match': {
            'Year': year
          }
        }, {
          '$match': {
            'Age': age
          }
        }, {
          '$set': {
            'TotalPopulation': {
              '$sum': {
                '$add': [
                  '$M', '$F'
                ]
              }
            }
          }
        }, {
          '$sort': {
            'Country': 1
          }
        }];
   
    const aggResults = await client.db(dbName).collection("country_population").aggregate(pipeline);
    console.log(`\nThe population of all continents for the ${year} year in the age group "${age}" :\n`);
    await aggResults.forEach(result => {
        console.log(result);
    });
}