const connection = require('./db');

connection.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Error executing test query:', err);
  } else {
    console.log('Test query executed successfully:', results);
  }
  connection.end();
});
