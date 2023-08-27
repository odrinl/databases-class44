var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port: 3306,
  user     : 'hyfuser',
  password : 'hyfpassword',
  database : 'userdb',
  // If you get connection with
  // errno: -61,
  // code: 'ECONNREFUSED',
  // Then, the following line will solve it
  // Note that your socket file path may be different
  // socketPath: '/tmp/ mysqladmin -p -u <user-name> variables'
  // port : xxxx // Uncomment this line and replace xxxx with the selected port number if you are not using default 3306. I also suggest to download MySQL version 5.7 because recent versions has authentication problems

});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();
