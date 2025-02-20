const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const { PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!PORT || !DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error("Missing required environment variables. Please check your .env file.");
  process.exit(1);
}

const app = express();
const port = PORT;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// 📌 Define API route for fetching Gantt chart data
app.get("/api/gantt-data", (req, res) => {
  const sql = `
    SELECT 
      courses.name AS Course, 
      instructors.name AS Instructor, 
      assignments.start_date, 
      assignments.duration 
    FROM assignments
    JOIN courses ON assignments.course_id = courses.id
    JOIN instructors ON assignments.instructor_id = instructors.id;
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching Gantt data:", err);
      return res.status(500).json({ error: "Database query failed", details: err });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
