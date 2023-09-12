// Import functions from setup.js and transfer.js
const setupDatabase = require('./setup');
const transferFunds = require('./transfer');

// Call the setup function to set up the database
setupDatabase()
  .then(() => {
    // Call the transfer function to perform a fund transfer
    transferFunds(101, 102, 1000, 'Transfer for purchase');
  })
  .catch((err) => {
    console.error('Error:', err);
  });
