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
  const { 
    title, type, university, date, end_date, color,
    start_time, end_time, description, venue, coordinator,
    status, photos_link, feedback_summary, attendance_count,
    event_outcome, remarks, feedback_submitted
  } = req.body;

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

    res.json({ message: "Event added", id: data[0].id });
  } catch (error) {
    console.error("Add Event Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
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
  const { id } = req.params;
  const updateData = req.body;

  try {
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
