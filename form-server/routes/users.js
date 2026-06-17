const express = require("express");
const supabase = require("../db");
const router = express.Router();

// Get all users (Admin only)
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, login_id, email, role, university");

    if (error) return res.status(500).json({ message: "Database error" });

    // Map to camelCase for frontend compatibility
    const users = data.map(u => ({
      id: u.id,
      loginId: u.login_id,
      email: u.email,
      role: u.role,
      university: u.university
    }));

    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, login_id, email, role, university")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return res.status(404).json({ message: "User not found" });
      return res.status(500).json({ message: "Database error" });
    }

    res.json({
      id: data.id,
      loginId: data.login_id,
      email: data.email,
      role: data.role,
      university: data.university
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role or university
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { role, university } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ role, university })
      .eq("id", id);

    if (error) return res.status(500).json({ message: "Database error" });

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ message: "Database error" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
