// Import MongoDB library
const { MongoClient } = require('mongodb');
// Load environment variables from .env file
require('dotenv').config(); 

const dbName = 'databaseWeek4';

// Sample data for accounts
const sampleAccounts = [
  {
    account_number: 101,
    balance: 10000,
    account_changes: [
      {
        change_number: 1,
        amount: 10000,
        changed_date: new Date(),
        remark: 'Initial deposit',
      },
    ],
  },
  {
    account_number: 102,
    balance: 5000,
    account_changes: [
      {
        change_number: 1,
        amount: 5000,
        changed_date: new Date(),
        remark: 'Initial deposit',
      },
    ],
  },
];

// Function to set up the database with sample data
async function setupDatabase() {
  const client = new MongoClient(MONGODB_URL);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    
    const db = client.db(dbName);
    const accountsCollection = db.collection('accounts');

    // Clear existing data in the accounts collection
    await accountsCollection.deleteMany({});

    // Insert sample account data
    await accountsCollection.insertMany(sampleAccounts);

    console.log('Database setup complete.');
  } catch (err) {
    console.error('Error setting up the database:', err);
  } finally {
    client.close();
  }
}

module.exports = setupDatabase;