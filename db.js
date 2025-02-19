const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ab(03Fg4i',
  database: 'SuperAdaptix_DB'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Function to get courses with assigned instructors
const getCoursesWithInstructors = () => {
  connection.query(`
    SELECT courses.name AS Course, instructors.name AS Instructor, assignments.start_date, assignments.duration 
    FROM assignments
    JOIN courses ON assignments.course_id = courses.id
    JOIN instructors ON assignments.instructor_id = instructors.id;
  `, (err, results) => {
    if (err) throw err;
    console.log(results);
  });
};

// Call the function
getCoursesWithInstructors();
