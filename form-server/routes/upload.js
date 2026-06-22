const express = require("express");
const multer = require("multer");
const router = express.Router();

// Configure multer to use memory storage for serverless environments (Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload/sop
router.post("/sop", upload.single("sopDocument"), async (req, res) => {
    try {
        if (req.file) {
            // Memory storage doesn't require manual cleanup
        }
        if (!req.file && !req.body.sopUrl) {
            return res.status(400).json({ message: "No document provided" });
        }

        const documentUrl = req.file ? `memory://${req.file.originalname}` : req.body.sopUrl;

        // TODO: Replace this mock implementation with actual LLM API call (OpenAI/Gemini)
        // 1. If req.file, parse text using pdf-parse or mammoth
        // 2. Send text to LLM with prompt: "Extract tasks from this SOP. Return JSON array..."

        // Mock LLM Response for Task Extraction
        const mockExtractedTasks = [
            {
                task_name: "Create Poster",
                task_description: "Design promotional material for the event",
                offset_days: -7,
                is_mandatory: true
            },
            {
                task_name: "Share Registration Form",
                task_description: "Create and distribute google form",
                offset_days: -7,
                is_mandatory: true
            },
            {
                task_name: "Reminder Campaign",
                task_description: "Send out emails and WhatsApp messages",
                offset_days: -2,
                is_mandatory: true
            },
            {
                task_name: "Arrange Venue",
                task_description: "Book auditorium and test AV equipment",
                offset_days: -1,
                is_mandatory: true
            },
            {
                task_name: "Conduct Event",
                task_description: "Execute the event according to schedule",
                offset_days: 0,
                is_mandatory: true
            },
            {
                task_name: "Submit Feedback",
                task_description: "Collect attendance and submit report",
                offset_days: 1,
                is_mandatory: false
            }
        ];

        // Simulate processing delay
        setTimeout(() => {
            res.json({
                message: "SOP Document processed successfully",
                documentUrl,
                extractedTasks: mockExtractedTasks
            });
        }, 2000);

    } catch (error) {
        console.error("SOP Upload Error:", error);
        res.status(500).json({ message: "Error processing SOP document" });
    }
});

module.exports = router;
