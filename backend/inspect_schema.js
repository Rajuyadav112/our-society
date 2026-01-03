const sequelize = require('./config/db');
const fs = require('fs');

async function inspect() {
    let output = '';
    const log = (msg) => {
        console.log(msg);
        output += msg + '\n';
    };

    try {
        await sequelize.authenticate();
        log('Connected');

        const [results] = await sequelize.query('PRAGMA table_info(Users);');
        log('Columns in Users table:');
        results.forEach(col => {
            log(`${col.cid}: ${col.name} (${col.type})`);
        });

        const [backupResults] = await sequelize.query('PRAGMA table_info(Users_backup);');
        if (backupResults.length > 0) {
            log('\nColumns in Users_backup table:');
            backupResults.forEach(col => {
                log(`${col.cid}: ${col.name} (${col.type})`);
            });
        } else {
            log('\nUsers_backup table does not exist.');
        }

    } catch (e) {
        log('Error: ' + e.message);
    } finally {
        await sequelize.close();
        fs.writeFileSync('schema_output_clean.txt', output, 'utf8');
    }
}

inspect();
