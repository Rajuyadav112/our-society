const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'society.db');
const outputPath = path.join(__dirname, 'postgres_data.sql');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("-- Error opening database:", err.message);
        process.exit(1);
    }
});

const escapeSqlString = (str) => {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'number') return str;
    if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
    if (typeof str === 'object') {
        if (str instanceof Date) return `'${str.toISOString()}'`;
        return `'${JSON.stringify(str).replace(/'/g, "''")}'`;
    }
    return `'${String(str).replace(/'/g, "''")}'`;
};

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", [], (err, tables) => {
        if (err) {
            console.error("-- Error fetching tables:", err);
            process.exit(1);
        }

        if (tables.length === 0) {
            console.log("-- No tables found in the database.");
            db.close(); // Ensure db is closed even if no tables
            return;
        }

        let completed = 0;
        let allQueries = [];

        tables.forEach((tableObj) => {
            const tableName = tableObj.name;

            db.all(`SELECT * FROM "${tableName}"`, [], (err, rows) => {
                if (err) {
                    console.error(`-- Error reading table ${tableName}:`, err);
                } else if (rows.length > 0) {
                    allQueries.push(`\n-- Data for table: ${tableName}`);

                    const columns = Object.keys(rows[0]);
                    const colList = columns.map(c => `"${c}"`).join(', ');

                    rows.forEach(row => {
                        const values = columns.map(col => escapeSqlString(row[col])).join(', ');
                        allQueries.push(`INSERT INTO "${tableName}" (${colList}) VALUES (${values});`);
                    });
                } else {
                    allQueries.push(`\n-- Table ${tableName} is empty`);
                }

                completed++;
                if (completed === tables.length) {
                    try {
                        fs.writeFileSync(outputPath, allQueries.join('\n'), 'utf8');
                        console.log(`Successfully wrote to ${outputPath}`);
                    } catch (writeErr) {
                        console.error('Error writing file:', writeErr);
                    }
                    db.close();
                }
            });
        });
    });
});
