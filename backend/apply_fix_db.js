const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./society.db');

const queries = [
    // Users table additions
    "ALTER TABLE Users ADD COLUMN lastSeen DATETIME",
    "ALTER TABLE Users ADD COLUMN createdAt DATETIME",
    "ALTER TABLE Users ADD COLUMN updatedAt DATETIME",

    // Messages table additions
    "ALTER TABLE Messages ADD COLUMN imageUrl TEXT",
    "ALTER TABLE Messages ADD COLUMN fileUrl TEXT",
    "ALTER TABLE Messages ADD COLUMN fileName TEXT",
    "ALTER TABLE Messages ADD COLUMN createdAt DATETIME",
    "ALTER TABLE Messages ADD COLUMN updatedAt DATETIME"
];

db.serialize(() => {
    queries.forEach(query => {
        db.run(query, (err) => {
            if (err) {
                console.log(`Query failed or column already exists: ${query.split('ADD COLUMN')[1]?.trim() || query}`);
            } else {
                console.log(`Successfully added: ${query.split('ADD COLUMN')[1]?.trim() || query}`);
            }
        });
    });
});

db.close();
