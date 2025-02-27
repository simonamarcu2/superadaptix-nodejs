const connection = require('./db');

connection.query('SELECT 1', (err, results) => {
  if (err) {
    throw new Error('Error executing query: ' + err.message);
  }
  connection.end();
});
