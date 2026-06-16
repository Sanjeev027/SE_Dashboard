const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  const { loginId, email, password, role, university } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (login_id, email, password, role, university) VALUES ($1, $2, $3, $4, $5)";
    db.query(sql, [loginId, email, hashedPassword, role || 'manager', university || 'All Universities'], (err, result) => {
      if (err) {
        console.log("DATABASE ERROR:", err);

        if (err.code === "23505") {
          if (err.detail && err.detail.includes("login_id")) {
            return res.status(400).json({ message: "Login ID already exists" });
          }
          if (err.detail && err.detail.includes("email")) {
            return res.status(400).json({ message: "Email already exists" });
          }
        }

        return res.status(500).json({ message: "Database error" });
      }

      return res.json({ message: "Account created successfully" });
    });
  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", (req, res) => {
  const { loginId, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = $1 OR login_id = $2";
  db.query(sql, [loginId, loginId], async (err, result) => {
    if (err) {
      console.log("DATABASE ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Gmail or Login ID" });
    }

    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: result.rows[0].id,
        loginId: result.rows[0].login_id,
        email: result.rows[0].email,
        role: result.rows[0].role,
        university: result.rows[0].university
      },
    });
  });
});

module.exports = router;
