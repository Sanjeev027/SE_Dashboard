const express = require("express");
const bcrypt = require("bcryptjs");
const supabase = require("../db");

const router = express.Router();

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  const { loginId, email, password, role, university } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{
        login_id: loginId,
        email: email,
        password: hashedPassword,
        role: role || "manager",
        university: university || "All Universities"
      }]);

    if (error) {
      console.log("DATABASE ERROR:", error);

      if (error.code === "23505") {
        if (error.message && error.message.includes("login_id")) {
          return res.status(400).json({ message: "Login ID already exists" });
        }
        if (error.message && error.message.includes("email")) {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(400).json({ message: "Duplicate entry" });
      }

      return res.status(500).json({ message: "Database error" });
    }

    return res.json({ message: "Account created successfully" });
  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${loginId},login_id.eq.${loginId}`);

    if (error) {
      console.log("DATABASE ERROR:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (!data || data.length === 0) {
      return res.status(401).json({ message: "Invalid Gmail or Login ID" });
    }

    const user = data[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        loginId: user.login_id,
        email: user.email,
        role: user.role,
        university: user.university
      },
    });
  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
