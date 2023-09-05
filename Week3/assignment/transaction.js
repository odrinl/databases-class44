const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'transactions', 
});

// Function to perform the transaction asynchronously
const performTransaction = async () => {
  try {
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const amountToTransfer = 999;
    const senderAccount = 12345;
    const receiverAccount = 12346;

    // Step 1: Check if the sender has sufficient balance
    const senderBalanceQuery = 'SELECT balance FROM account WHERE account_number = ?';
    const [senderBalanceResult] = await db.promise().query(senderBalanceQuery, [senderAccount]);
    const senderBalance = senderBalanceResult[0].balance;

    if (senderBalance < amountToTransfer) {
      throw new Error('Insufficient balance for the transaction.');
    }

    // Step 2: Deduct the amount from the sender's account
    const deductQuery = 'UPDATE account SET balance = balance - ? WHERE account_number = ?';
    await db.promise().execute(deductQuery, [amountToTransfer, senderAccount]);

    // Step 3: Add the amount to the receiver's account
    const addQuery = 'UPDATE account SET balance = balance + ? WHERE account_number = ?';
    await db.promise().execute(addQuery, [amountToTransfer, receiverAccount]);

    // Step 4: Log the transaction in the account_changes table
    const remarkSender = 'Transfer to ' + receiverAccount;
    const remarkReceiver = 'Transfer from ' + senderAccount;

    const insertChangeQuery =
      'INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?), (?, ?, ?)';
    await db.promise().execute(insertChangeQuery, [
      senderAccount,
      -amountToTransfer,
      remarkSender,
      receiverAccount,
      amountToTransfer,
      remarkReceiver,
    ]);

    // Step 5: Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Transaction complete.');
  } catch (error) {
    console.error('Transaction failed:', error.message);

    // Step 6: Rollback the transaction on error
    await new Promise((resolve, reject) => {
      db.rollback(() => {
        resolve();
      });
    });
  } finally {
    db.end((err) => {
      if (err) {
        console.error('Error closing database connection:', err);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
};

// Call the asynchronous transaction function
performTransaction();
