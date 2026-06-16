const db = require("./db");

db.query("DESCRIBE users", (err, result) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("Columns:", result.map(c => c.Field));
    }
    process.exit();
});
