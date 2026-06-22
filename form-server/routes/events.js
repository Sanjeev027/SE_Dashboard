const express = require("express");
const supabase = require("../db");
const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) return res.status(500).json({ message: "Database error" });

    res.json(data);
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new event
router.post("/", async (req, res) => {
  const role = req.headers["x-user-role"];
  const userUniversity = req.headers["x-user-university"];

  if (role !== "central_admin" && role !== "campus_admin") {
    return res.status(403).json({ success: false, message: "Unauthorized access" });
  }

  const { 
    title, type, university, date, end_date, color,
    start_time, end_time, description, venue, coordinator,
    status, photos_link, feedback_summary, attendance_count,
    event_outcome, remarks, feedback_submitted,
    sopTasks
  } = req.body;

  if (role === "campus_admin" && userUniversity !== university) {
    return res.status(403).json({ success: false, message: "Unauthorized access: Cannot create event for another campus" });
  }

  try {
    const { data, error } = await supabase
      .from("events")
      .insert([{
        title,
        type,
        university,
        date,
        end_date: end_date || date,
        color,
        start_time, end_time, description, venue, coordinator,
        status: status || 'Scheduled', photos_link, feedback_summary,
        attendance_count, event_outcome, remarks,
        feedback_submitted: feedback_submitted || false
      }])
      .select("id");

    if (error) {
      console.error("Add Event Error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    const newEventId = data[0].id;

    if (sopTasks && Array.isArray(sopTasks) && sopTasks.length > 0) {
      const taskInserts = sopTasks.map(t => ({
        title: t.task_name,
        description: t.task_description,
        assigned_team: t.assigned_to || "Operations Team",
        priority: "Medium",
        status: "Pending",
        university: university,
        event_id: newEventId,
        due_date: t.due_date,
        task_source: "sop"
      }));
      
      const { error: taskError } = await supabase.from("tasks").insert(taskInserts);
      if (taskError) {
        console.error("Error inserting auto-generated tasks:", taskError);
      }
    }

    res.json({ message: "Event added", id: newEventId });
  } catch (error) {
    console.error("Add Event Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  const role = req.headers["x-user-role"];
  
  if (role !== "central_admin") {
    return res.status(403).json({ success: false, message: "Unauthorized access" });
  }

  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ message: "Database error" });

    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an event
router.put("/:id", async (req, res) => {
  const role = req.headers["x-user-role"];
  const userUniversity = req.headers["x-user-university"];

  if (!role || role === "viewer") {
    return res.status(403).json({ success: false, message: "Unauthorized access" });
  }

  const { id } = req.params;
  let updateData = req.body;

  if (role === "event_coordinator") {
    updateData = {
      status: req.body.status,
      remarks: req.body.remarks,
      feedback_summary: req.body.feedback_summary,
      attendance_count: req.body.attendance_count,
      event_outcome: req.body.event_outcome,
      photos_link: req.body.photos_link,
      feedback_submitted: req.body.feedback_submitted
    };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
  }

  try {
    if (role !== "central_admin") {
      const { data: existingEvent } = await supabase.from("events").select("university").eq("id", id).single();
      if (!existingEvent || existingEvent.university !== userUniversity) {
        return res.status(403).json({ success: false, message: "Unauthorized access: Campus mismatch" });
      }
    }

    const { data, error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Update Event Error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Event updated" });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all event reports
router.get("/reports/all", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*");

    if (error) return res.status(500).json({ message: "Database error" });

    res.json(data);
  } catch (error) {
    console.error("Get Reports Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit report for an event
router.post("/:id/report", async (req, res) => {
  const { id } = req.params;
  const { reportContent, university } = req.body;

  if (!university) {
    return res.status(400).json({ message: "University is required" });
  }

  try {
    const { data, error } = await supabase
      .from("reports")
      .upsert(
        {
          event_id: id,
          university: university,
          report_content: reportContent
        },
        { onConflict: "event_id,university" }
      );

    if (error) {
      console.error("Submit Report Error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Report submitted successfully" });
  } catch (error) {
    console.error("Submit Report Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
