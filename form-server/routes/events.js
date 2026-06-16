const express = require("express");
const db = require("../db");
const router = express.Router();

// Get all events
router.get("/", (req, res) => {
    const sql = "SELECT * FROM events ORDER BY date ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
});

// Add a new event
router.post("/", (req, res) => {
    const { title, type, university, date, end_date, color } = req.body;
    const sql = "INSERT INTO events (title, type, university, date, end_date, color) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, type, university, date, end_date || date, color], (err, result) => {
        if (err) {
            console.error("Add Event Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Event added", id: result.insertId });
    });
});

// Delete an event
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM events WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Event deleted" });
    });
});

// Get all event reports
router.get("/reports/all", (req, res) => {
    const sql = "SELECT * FROM reports";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
});

// Submit report for an event
router.post("/:id/report", (req, res) => {
    const { id } = req.params;
    const { reportContent, university } = req.body;
    
    if (!university) {
        return res.status(400).json({ message: "University is required" });
    }

    const sql = "INSERT INTO reports (event_id, university, report_content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE report_content = ?";
    db.query(sql, [id, university, reportContent, reportContent], (err, result) => {
        if (err) {
            console.error("Submit Report Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Report submitted successfully" });
    });
});

module.exports = router;
