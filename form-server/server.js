const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://se-dashboard-sandy.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// Simple status route
app.get("/", (req, res) => {
    res.json({ message: "Academia_HuB API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
