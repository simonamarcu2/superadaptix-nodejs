const express = require("express");
const router = express.Router();
const db = require("../db");
const cors = require("cors");

router.use(cors());
router.use(express.json());

router.post("/", (req, res) => {
  console.log("Received request body:", req.body);

  const { course_id, instructor_id, start_date, duration } = req.body;

  if (!course_id || !instructor_id || !start_date || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const end_date = new Date(start_date);
  end_date.setDate(end_date.getDate() + parseInt(duration, 10));

  const sql = `INSERT INTO assignments (course_id, instructor_id, start_date, duration, end_date) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [course_id, instructor_id, start_date, duration, end_date], (err, result) => {
    if (err) {
      console.error("Error adding assignment:", err);
      return res.status(500).json({ error: "Database query failed", details: err });
    }
    res.status(201).json({ message: "Assignment created", assignmentId: result.insertId });
  });
});

router.put("/:id", (req, res) => {
  const assignmentId = req.params.id;
  const { course_id, instructor_id, start_date, duration } = req.body;

  const end_date = new Date(start_date);
  end_date.setDate(end_date.getDate() + duration);

  const sql = `UPDATE assignments SET course_id = ?, instructor_id = ?, start_date = ?, duration = ?, end_date = ? WHERE id = ?`;
  db.query(
    sql,
    [course_id, instructor_id, start_date, duration, end_date, assignmentId],
    (err, result) => {
      if (err) {
        console.error("Error updating assignment:", err);
        return res
          .status(500)
          .json({ error: "Database query failed", details: err });
      }

      res.json({
        message: "Assignment updated",
        task: {
          id: assignmentId,
          text: `Instructor ${instructor_id}`,
          start_date: start_date,
          duration: duration,
          end_date: end_date.toISOString().split("T")[0],
          parent: course_id,
        },
      });
    }
  );
});

router.get("/", (req, res) => {
  const sql = `
    SELECT 
      a.id AS assignment_id, 
      a.course_id, 
      a.instructor_id, 
      a.start_date AS instructor_start_date, 
      a.end_date AS instructor_end_date,
      c.name AS course_name,
      i.name AS instructor_name
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
    JOIN instructors i ON a.instructor_id = i.id
    ORDER BY a.course_id, a.instructor_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching assignments:", err);
      return res.status(500).json({ error: "Database query failed", details: err });
    }

    const assignments = results.reduce((acc, row) => {
      if (!acc[row.course_id]) {
        acc[row.course_id] = {
          id: row.course_id,
          name: row.course_name,
          start_date: row.instructor_start_date,
          end_date: row.instructor_end_date,
          instructors: [],
        };
      }

      acc[row.course_id].instructors.push({
        id: row.instructor_id,
        name: row.instructor_name,
        start_date: row.instructor_start_date,
        end_date: row.instructor_end_date,
      });

      if (new Date(row.instructor_start_date) < new Date(acc[row.course_id].start_date)) {
        acc[row.course_id].start_date = row.instructor_start_date;
      }

      if (new Date(row.instructor_end_date) > new Date(acc[row.course_id].end_date)) {
        acc[row.course_id].end_date = row.instructor_end_date;
      }

      return acc;
    }, {});

    const response = Object.values(assignments).map(assignment => ({
      id: assignment.id,
      name: assignment.name,
      start_date: assignment.start_date,
      end_date: assignment.end_date,
      instructors: assignment.instructors,
    }));

    res.json({ assignments: response });
  });
});

router.delete("/:id", (req, res) => {
  const assignmentId = req.params.id;

  const sql = `DELETE FROM assignments WHERE id = ?`;
  db.query(sql, [assignmentId], (err, result) => {
    if (err) {
      console.error("Error deleting assignment:", err);
      return res
        .status(500)
        .json({ error: "Database query failed", details: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json({ message: "Assignment deleted", taskId: assignmentId });
  });
});

module.exports = router;
