1. Give an example of a value that can be passed as name and code that would take advantage of SQL-injection and ( fetch all the records in the database)

```sql
SELECT Population FROM CountryTable WHERE Name = '' OR '1'='1' and code = '' OR '1'='1'
```
2. Rewrite the function so that it is no longer vulnerable to SQL injection

```sql
function getPopulation(Country, name, code, cb) {
  // Assuming that connection to the database is established and stored as conn
  conn.query(
    'SELECT Population FROM ?? WHERE Name = ? and code = ?',
    [Country, name, code],
    function (err, result) {
      if (err) cb(err);
      if (result.length === 0) cb(new Error('Not found'));
      cb(null, result[0].Population);
    }
  );
}
```

In this version of the function, we use placeholders ??, ?, and ? for the table name, name, and code, respectively. We then pass an array of values to replace these placeholders in the query. Using parameterized queries like this prevents SQL injection because the database driver handles the escaping of user input, ensuring that it's treated as data, not SQL commands.