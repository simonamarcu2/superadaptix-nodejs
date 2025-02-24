const express = require('express');
const router = express.Router();
const db = require('../db');

router.post("/", (req, res) => {
  const { name } = req.body;

  const sql = `INSERT INTO instructors (name) VALUES (?)`;
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error("Error adding instructor:", err);
      return res
        .status(500)
        .json({ error: "Database query failed", details: err });
    }
    res
      .status(201)
      .json({ message: "Instructor created", instructorId: result.insertId });
  });
});

router.put("/:id", (req, res) => {
  const instructorId = req.params.id;
  const { name } = req.body;

  const sql = `UPDATE instructors SET name = ? WHERE id = ?`;
  db.query(sql, [name, instructorId], (err, result) => {
    if (err) {
      console.error("Error updating instructor:", err);
      return res
        .status(500)
        .json({ error: "Database query failed", details: err });
    }
    res.json({ message: "Instructor updated" });
  });
});

router.get("/", (req, res) => {
  const sql = `SELECT * FROM instructors`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching instructors:", err);
      return res.status(500).json({ error: "Database query failed", details: err });
    }
    res.json({ instructors: results });
  });
});

router.delete("/:id", (req, res) => {
  const instructorId = req.params.id;

  const sql = `DELETE FROM instructors WHERE id = ?`;
  db.query(sql, [instructorId], (err, result) => {
    if (err) {
      console.error("Error deleting instructor:", err);
      return res
        .status(500)
        .json({ error: "Database query failed", details: err });
    }
    res.json({ message: "Instructor deleted" });
  });
});

module.exports = router;
