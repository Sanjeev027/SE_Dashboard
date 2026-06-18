const express = require("express");
const supabase = require("../db");
const router = express.Router();

// Get tasks
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) return res.status(500).json({ message: "Database error" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Create task
router.post("/", async (req, res) => {
    const { title, description, status, priority, assigned_team, university, created_by } = req.body;
    try {
        const { data, error } = await supabase
            .from("tasks")
            .insert([{ title, description, status, priority, assigned_team, university, created_by }])
            .select();

        if (error) return res.status(500).json({ message: error.message });
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update task status
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const { data, error } = await supabase
            .from("tasks")
            .update({ status })
            .eq("id", id)
            .select();

        if (error) return res.status(500).json({ message: "Database error" });
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete task
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
