const mysql = require('mysql2');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
require('dotenv').config();


const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

db.connect((err) => {
  if (err) {
    return;
  }
});

const getCoursesWithInstructors = () => {
  db.query(`
    SELECT courses.name AS Course, instructors.name AS Instructor, assignments.start_date, assignments.duration 
    FROM assignments
    JOIN courses ON assignments.course_id = courses.id
    JOIN instructors ON assignments.instructor_id = instructors.id;
  `, (err, results) => {
    if (err) throw err;
  });
};

getCoursesWithInstructors()

module.exports = db;
