// Import functions from setup.js and transfer.js
const setupDatabase = require('./setup');
const transferFunds = require('./transfer');

// Import MongoDB library
const { MongoClient } = require('mongodb');
// Load environment variables from .env file
require('dotenv').config();

// Access environment variable
const uri = process.env.MONGODB_URL;

async function main() {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Setup the database
        await setupDatabase(client);

        // Transfer 1000 from account "101" to account "102"
        await transferFunds(client, 101, 102, 1000, 'Transfer for purchase');

      } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main();
