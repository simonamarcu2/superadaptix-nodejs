require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { URL } = require('url');

const jawsdbUrl = process.env.JAWSDB_URL;
const mysqlUrl = new URL(jawsdbUrl);

const dbConfig = {
  host: mysqlUrl.hostname,
  port: mysqlUrl.port,
  user: mysqlUrl.username,
  password: mysqlUrl.password,
  database: mysqlUrl.pathname.replace(/^\//, ""),
};

console.log(dbConfig);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
