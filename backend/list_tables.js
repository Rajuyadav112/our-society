const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './society.db',
    logging: false
});

async function listTables() {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table';");
        console.log('Tables in database:', results.map(r => r.name));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

listTables();
