const sequelize = require('./config/db');

async function fix() {
    try {
        await sequelize.authenticate();
        console.log('Connected');
        await sequelize.query('DROP TABLE IF EXISTS "Users_backup"');
        console.log('Dropped Users_backup');
        // Also drop possible other backups if any
        await sequelize.query('DROP TABLE IF EXISTS "users_backup"');
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

fix();
