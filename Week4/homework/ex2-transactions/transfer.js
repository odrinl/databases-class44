// Import MongoDB library
const { MongoClient } = require('mongodb');
// Load environment variables from .env file
require('dotenv').config();

// Access environment variables
const uri = process.env.MONGODB_URL;

const dbName = 'databaseWeek4';

// Function to get the current date and time in a human-readable format
function getCurrentDateTime() {
  const currentDate = new Date();
  return currentDate.toLocaleString(undefined, { hour12: false });
}

// Function to perform a fund transfer between two accounts
async function transferFunds(
  fromAccountNumber,
  toAccountNumber,
  amount,
  remark
) {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const accountsCollection = db.collection('accounts');

    // Find the sender and receiver accounts
    const senderAccount = await accountsCollection.findOne({
      account_number: fromAccountNumber,
    });
    const receiverAccount = await accountsCollection.findOne({
      account_number: toAccountNumber,
    });

    if (!senderAccount || !receiverAccount) {
      console.error('Sender or receiver account not found.');
      return;
    }

    if (senderAccount.balance < amount) {
      console.error('Insufficient balance for the transfer.');
      return;
    }

    // Update sender's and receiver's balances
    const updatedSenderBalance = senderAccount.balance - amount;
    const updatedReceiverBalance = receiverAccount.balance + amount;

    // Generate change numbers
    const senderChangeNumber = senderAccount.account_changes.length + 1;
    const receiverChangeNumber = receiverAccount.account_changes.length + 1;

    // Create change objects for sender and receiver
    const senderChange = {
      change_number: senderChangeNumber,
      amount: -amount,
      changed_date: getCurrentDateTime(),
      remark,
    };

    const receiverChange = {
      change_number: receiverChangeNumber,
      amount,
      changed_date: getCurrentDateTime(),
      remark,
    };

    // Update account changes arrays
    senderAccount.account_changes.push(senderChange);
    receiverAccount.account_changes.push(receiverChange);

    // Update account balances
    await accountsCollection.updateOne(
      { account_number: fromAccountNumber },
      {
        $set: {
          balance: updatedSenderBalance,
          account_changes: senderAccount.account_changes,
        },
      }
    );
    await accountsCollection.updateOne(
      { account_number: toAccountNumber },
      {
        $set: {
          balance: updatedReceiverBalance,
          account_changes: receiverAccount.account_changes,
        },
      }
    );

    console.log('Funds transferred successfully.');
  } catch (err) {
    console.error('Error transferring funds:', err);
  } finally {
    client.close();
  }
}

module.exports = transferFunds;
