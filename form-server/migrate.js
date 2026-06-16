const db = require("./db");

const migrations = [
    // 1. Add role and university to users
    `ALTER TABLE users 
   ADD COLUMN IF NOT EXISTS role ENUM('central', 'manager') DEFAULT 'manager',
   ADD COLUMN IF NOT EXISTS university VARCHAR(255) DEFAULT 'All Universities';`,

    // 2. Create events table
    `CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    university VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

    // 3. Add report columns to events
    `ALTER TABLE events 
   ADD COLUMN IF NOT EXISTS report_submitted TINYINT DEFAULT 0,
   ADD COLUMN IF NOT EXISTS report_content TEXT DEFAULT NULL;`
];

async function runMigrations() {
    for (const sql of migrations) {
        try {
            await db.promise().query(sql);
            console.log("Migration successful:", sql.substring(0, 50) + "...");
        } catch (err) {
            console.error("Migration error:", err.message);
        }
    }
}

runMigrations().then(() => {
    // Add a sample central user if not exists
    const checkSql = "SELECT * FROM users WHERE login_id = 'admin'";
    db.query(checkSql, (err, result) => {
        if (result && result.length === 0) {
            const bcrypt = require("bcryptjs");
            const hash = bcrypt.hashSync("admin123", 10);
            const insertSql = "INSERT INTO users (login_id, email, password, role, university) VALUES (?, ?, ?, ?, ?)";
            db.query(insertSql, ['admin', 'admin@niat.com', hash, 'central', 'All Universities'], (err) => {
                if (err) console.error("Error creating admin:", err);
                else console.log("System Admin created: admin / admin123");
                process.exit();
            });
        } else {
            process.exit();
        }
    });
});
