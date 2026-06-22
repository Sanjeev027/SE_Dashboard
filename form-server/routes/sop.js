const express = require("express");
const supabase = require("../db");
const router = express.Router();

// Get SOP templates by event type
router.get("/:eventType", async (req, res) => {
  const { eventType } = req.params;

  try {
    const { data, error } = await supabase
      .from("sop_templates")
      .select("*")
      .eq("event_type", eventType)
      .order("offset_days", { ascending: true });

    if (error) {
      console.error("Get SOP Templates Error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(data);
  } catch (error) {
    console.error("Get SOP Templates Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all SOP templates
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sop_templates")
      .select("*")
      .order("event_type", { ascending: true });

    if (error) return res.status(500).json({ message: "Database error" });

    res.json(data);
  } catch (error) {
    console.error("Get All SOPs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
