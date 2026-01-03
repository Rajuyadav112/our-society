const sequelize = require('./config/db');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('Connected');
        const [results] = await sequelize.query('SELECT phone, COUNT(*) as count FROM Users GROUP BY phone HAVING count > 1');
        console.log('Duplicate phones:', results);

        // Also check for duplicate IDs just in case
        const [ids] = await sequelize.query('SELECT id, COUNT(*) as count FROM Users GROUP BY id HAVING count > 1');
        console.log('Duplicate IDs:', ids);

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

check();
