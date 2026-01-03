const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./society.db');

db.all("SELECT phone FROM Users LIMIT 5", (err, rows) => {
    if (err) console.error(err);
    else console.log("Users:", rows);
});

db.close();
