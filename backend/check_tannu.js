const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./society.db');

db.get('SELECT name, phone, role FROM Users WHERE name LIKE "%tannu%" OR phone = "9876543211"', (err, row) => {
    if (err) {
        console.error(err);
    } else {
        console.log('RESULT:', JSON.stringify(row));
    }
    db.close();
});
