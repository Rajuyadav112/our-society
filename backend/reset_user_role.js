const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./society.db');

db.run('UPDATE Users SET role = "resident" WHERE phone = "9876543211"', function (err) {
    if (err) {
        console.error('Error resetting role:', err.message);
    } else {
        console.log(`Successfully reset role for tannu. Rows affected: ${this.changes}`);
    }
    db.close();
});
