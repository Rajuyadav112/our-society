const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './society.db',
    logging: false
});

async function check() {
    try {
        const [results] = await sequelize.query("PRAGMA table_info(VisitorLogs);");
        console.log('Columns in VisitorLogs table:');
        results.forEach(c => console.log(`- ${c.name} (${c.type})`));
    } catch (err) {
        console.error(err);
    }
}
check();
