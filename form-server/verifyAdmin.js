const db = require("./db");

db.query("SELECT login_id, role, university FROM users WHERE login_id = 'admin'", (err, result) => {
    if (err) console.error(err);
    else console.log("User:", result);
    process.exit();
});
