const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./society.db');

db.serialize(() => {
    db.run("ALTER TABLE Users ADD COLUMN otp TEXT", (err) => {
        if (err) console.log("otp column might already exist or error:", err.message);
        else console.log("otp column added");
    });
    db.run("ALTER TABLE Users ADD COLUMN otpExpires DATETIME", (err) => {
        if (err) console.log("otpExpires column might already exist or error:", err.message);
        else console.log("otpExpires column added");
    });
});

db.close();
