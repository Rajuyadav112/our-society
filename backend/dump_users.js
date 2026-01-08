const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './society.db',
    logging: false
});

async function rawQuery() {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("SELECT name, phone, password, role FROM Users;");
        console.log('\n--- Resident Directory (Database Dump) ---');
        console.log(JSON.stringify(results, null, 2));
        console.log('\nNote: Passwords are encrypted (hashed) for security.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

rawQuery();
