const express = require("express");
const supabase = require("../db");
const router = express.Router();

// Get tasks
router.get("/", async (req, res) => {
    try {
        let query = supabase.from("tasks").select("*");

        if (req.query.event_id) {
            query = query.eq("event_id", req.query.event_id);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) return res.status(500).json({ message: "Database error" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Create task
router.post("/", async (req, res) => {
    const { title, description, status, priority, assigned_team, university, created_by, event_id, due_date, task_source, remarks } = req.body;
    try {
        const { data, error } = await supabase
            .from("tasks")
            .insert([{ title, description, status, priority, assigned_team, university, created_by, event_id, due_date, task_source: task_source || 'manual', remarks }])
            .select();

        if (error) return res.status(500).json({ message: error.message });
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Create task batch (SOP Upload)
router.post("/batch", async (req, res) => {
    const { tasks } = req.body;
    try {
        const { data, error } = await supabase
            .from("tasks")
            .insert(tasks)
            .select();

        if (error) return res.status(500).json({ message: error.message });
        res.json({ message: "Tasks submitted for approval", tasks: data });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Approve batch
router.put("/batch/:batch_id/approve", async (req, res) => {
    const { batch_id } = req.params;
    try {
        const { data, error } = await supabase
            .from("tasks")
            .update({ status: 'Assigned' })
            .eq("batch_id", batch_id)
            .select();
            
        if (error) return res.status(500).json({ message: error.message });
        res.json({ message: "Tasks approved and assigned", tasks: data });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Reject batch
router.put("/batch/:batch_id/reject", async (req, res) => {
    const { batch_id } = req.params;
    const { comments } = req.body;
    try {
        const { data, error } = await supabase
            .from("tasks")
            .update({ status: 'Rejected', approval_comments: comments })
            .eq("batch_id", batch_id)
            .select();
            
        if (error) return res.status(500).json({ message: error.message });
        res.json({ message: "Tasks rejected", tasks: data });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update task status
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { status, remarks, due_date, assigned_team } = req.body;
    try {
        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (remarks !== undefined) updateData.remarks = remarks;
        if (due_date !== undefined) updateData.due_date = due_date;
        if (assigned_team !== undefined) updateData.assigned_team = assigned_team;

        const { data, error } = await supabase
            .from("tasks")
            .update(updateData)
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

// CRON Job: Check reminders and update missed tasks
router.get("/cron/check-reminders", async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // 1. Mark overdue tasks as Missed
        const { data: missedTasks, error: missedError } = await supabase
            .from("tasks")
            .update({ status: 'Missed' })
            .lt("due_date", today)
            .in("status", ["Pending", "In Progress"])
            .select();
            
        if (missedError) console.error("Error updating missed tasks:", missedError);
        
        // 2. Fetch tasks due today for reminder
        const { data: dueToday, error: dueError } = await supabase
            .from("tasks")
            .select("*")
            .eq("due_date", today)
            .in("status", ["Pending", "In Progress"]);
            
        if (dueError) console.error("Error fetching due today tasks:", dueError);
        
        // In a real app, send emails/WhatsApp here.
        
        res.json({
            message: "CRON Job executed successfully",
            markedMissed: missedTasks?.length || 0,
            dueToday: dueToday?.length || 0,
            timestamp: new Date()
        });
    } catch (err) {
        console.error("CRON Error:", err);
        res.status(500).json({ message: "Server error in CRON job" });
    }
});

module.exports = router;
