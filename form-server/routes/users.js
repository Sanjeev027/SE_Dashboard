const express = require("express");
const db = require("../db");
const router = express.Router();

// Get all users (Admin only)
router.get("/", (req, res) => {
    const sql = 'SELECT id, login_id AS "loginId", email, role, university FROM users';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(result.rows);
    });
});

// Get specific user by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT id, login_id AS "loginId", email, role, university FROM users WHERE id = $1';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(result.rows[0]);
    });
});

// Update user role or university
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { role, university } = req.body;

    const sql = "UPDATE users SET role = $1, university = $2 WHERE id = $3";
    db.query(sql, [role, university, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "User updated successfully" });
    });
});

// Delete user
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id = $1";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "User deleted successfully" });
    });
});

module.exports = router;
