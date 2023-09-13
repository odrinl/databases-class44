// Import MongoDB library
const { MongoClient } = require('mongodb');
// Load environment variables from .env file

const dbName = 'databaseWeek4';

// Function to get the current date and time in a human-readable format
function getCurrentDateTime() {
  const currentDate = new Date();
  return currentDate.toLocaleString(undefined, { hour12: false });
}

/**
 * Function to perform a fund transfer between two accounts
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the banking database
 * @param {String} fromAccountNumber The _id of the account where money should be subtracted
 * @param {String} toAccountNumber _id of the account where money should be added
 * @param {Number} amount The amount of money to be transferred
 * @param {String} remark The remark that should be added to the transaction
 */

async function transferFunds(
  client,
  fromAccountNumber,
  toAccountNumber,
  amount,
  remark
) {
  let session;

  try {
    
    const accountsCollection = client.db(dbName).collection('accounts');
    
  // Step 1: Start a Client Session
  session = client.startSession();

  // Step 2: Optional. Define options for the transaction
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };

    // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
    await session.withTransaction(async () => {

        // Remove the money from the first account
        const subtractMoneyResults = await accountsCollection.updateOne(
          { account_number: fromAccountNumber },
          {
            $inc: { balance: -amount }, 
            $push: { 
              account_changes: {
                change_number: { $inc: 1 },
                amount: -amount,
                changed_date: getCurrentDateTime(),
                remark,
              },
            },
          },
          { session }
        );
        console.log(`${subtractMoneyResults.matchedCount} document(s) found in the accounts collection with _id ${fromAccountNumber}.`);
        console.log(`${subtractMoneyResults.modifiedCount} document(s) was/were updated to remove the money.`);
        if (subtractMoneyResults.modifiedCount !== 1) {
            await session.abortTransaction();
            return;
        }

        // Add the money to the second account
        const addMoneyResults = await accountsCollection.updateOne(
          { account_number: toAccountNumber },
          {
            $inc: { balance: amount },
            $push: { 
              account_changes: {
                change_number: { $inc: 1 },
                amount,
                changed_date: getCurrentDateTime(),
                remark,
              },
            },
          },
          { session }
        );
        console.log(`${addMoneyResults.matchedCount} document(s) found in the accounts collection with _id ${toAccountNumber}.`);
        console.log(`${addMoneyResults.modifiedCount} document(s) was/were updated to add the money.`);
        if (addMoneyResults.modifiedCount !== 1) {
            await session.abortTransaction();
            return;
        }

    }, transactionOptions);
    console.log("The money was successfully transferred.");
  } catch (e) {
    console.log("The money transfer encountered an unexpected error: " + e);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}

module.exports = transferFunds;
