const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const db = require("./db");
const coursesRoutes = require("./routes/courses");
const instructorsRoutes = require("./routes/instructors");
const assignmentsRoutes = require("./routes/assignments");
const app = express();

if (!PORT || !DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use("/api/courses", coursesRoutes);
app.use("/api/instructors", instructorsRoutes);
app.use("/api/assignments", assignmentsRoutes);

const fetchGanttData = async () => {
  const [rows] = await db.query(`
    SELECT 
      c.id AS course_id, 
      c.name AS course_name, 
      i.id AS instructor_id, 
      i.name AS instructor_name, 
      a.start_date, 
      a.end_date, 
      DATEDIFF(a.end_date, a.start_date) AS duration
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
    JOIN instructors i ON a.instructor_id = i.id
  `);

  let ganttData = [];
  let courseMap = {};

  rows.forEach((row) => {
    if (!courseMap[row.course_id]) {
      ganttData.push({
        id: row.course_id,
        text: row.course_name,
        start_date: row.start_date,
        duration: row.duration,
        open: true,
      });
      courseMap[row.course_id] = true;
    }

    ganttData.push({
      id: `task_${row.instructor_id}`,
      text: row.instructor_name,
      start_date: row.start_date,
      duration: row.duration,
      parent: row.course_id,
      open: true,
    });
  });

  return ganttData;
};

app.get("/gantt-data", async (req, res) => {
  try {
    const ganttData = await fetchGanttData();
    res.json({ data: ganttData });
  } catch (error) {
    console.error("Error fetching Gantt data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  console.log(`Server is running on port ${PORT}`);app.listen(PORT, () => {
