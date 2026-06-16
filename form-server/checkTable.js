const db = require("./db");

db.query("DESCRIBE users", (err, result) => {
    if (err) {
        console.error("Error describing table:", err);
    } else {
        console.log("Table Structure:", result);
    }
    process.exit();
});
