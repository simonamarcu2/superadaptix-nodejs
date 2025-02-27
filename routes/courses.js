const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Course name is required" });
  }

  const sql = `INSERT INTO courses (name) VALUES (?)`;
  db.query(sql, [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed", details: err });
    }
    res.status(201).json({ message: "Course created", courseId: result.insertId });
  });
});

router.get("/", (req, res) => {
  const sql = `SELECT * FROM courses`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed", details: err });
    }
    res.json({ courses: results });
  });
});

router.put("/:id", (req, res) => {
  const courseId = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Course name is required" });
  }

  const sql = `UPDATE courses SET name = ? WHERE id = ?`;
  db.query(sql, [name, courseId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course updated" });
  });
});

router.delete("/:id", (req, res) => {
  const courseId = req.params.id;

  const checkSql = `SELECT * FROM assignments WHERE course_id = ?`;
  db.query(checkSql, [courseId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed", details: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Cannot delete course, it has assigned instructors" });
    }

    const deleteSql = `DELETE FROM courses WHERE id = ?`;
    db.query(deleteSql, [courseId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database query failed", details: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json({ message: "Course deleted" });
    });
  });
});

module.exports = router;
