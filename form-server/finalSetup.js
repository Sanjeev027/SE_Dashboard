const db = require("./db");
const bcrypt = require("bcryptjs");

async function setup() {
    try {
        console.log("Starting database setup...");

        // 1. Add columns (using try-catch for each in case they exist)
        try {
            await db.promise().query("ALTER TABLE users ADD COLUMN role ENUM('central', 'manager') DEFAULT 'manager'");
            console.log("Added 'role' column.");
        } catch (e) { console.log("'role' column might already exist."); }

        try {
            await db.promise().query("ALTER TABLE users ADD COLUMN university VARCHAR(255) DEFAULT 'All Universities'");
            console.log("Added 'university' column.");
        } catch (e) { console.log("'university' column might already exist."); }

        // 2. Create events table
        const createEventsSql = `
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                type VARCHAR(100) NOT NULL,
                university VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                color VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.promise().query(createEventsSql);
        console.log("Events table ensured.");

        // Create reports table
        const createReportsSql = `
            CREATE TABLE IF NOT EXISTS reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_id INT NOT NULL,
                university VARCHAR(255) NOT NULL,
                report_content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_event_uni (event_id, university)
            )
        `;
        await db.promise().query(createReportsSql);
        console.log("Reports table ensured.");

        try {
            await db.promise().query("ALTER TABLE events ADD COLUMN report_submitted TINYINT DEFAULT 0");
            await db.promise().query("ALTER TABLE events ADD COLUMN report_content TEXT DEFAULT NULL");
            console.log("Added report columns to events table.");
        } catch (e) { console.log("Report columns might already exist."); }

        // 3. Create Admin user
        const loginId = 'admin';
        const [rows] = await db.promise().query("SELECT * FROM users WHERE login_id = ?", [loginId]);

        if (rows.length === 0) {
            const hash = await bcrypt.hash("admin123", 10);
            await db.promise().query(
                "INSERT INTO users (login_id, email, password, role, university) VALUES (?, ?, ?, ?, ?)",
                ['admin', 'admin@niat.com', hash, 'central', 'All Universities']
            );
            console.log("Admin account created: admin / admin123");
        } else {
            // Update existing user to be central admin if it exists
            await db.promise().query(
                "UPDATE users SET role = 'central', university = 'All Universities' WHERE login_id = ?",
                ['admin']
            );
            console.log("Admin account updated to central role.");
        }

        console.log("Database setup completed successfully.");
    } catch (err) {
        console.error("Setup failed:", err);
    } finally {
        process.exit();
    }
}

setup();
