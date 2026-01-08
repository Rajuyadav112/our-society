const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './society.db',
    logging: false
});

async function runQuery(query) {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        const [results] = await sequelize.query(query);

        if (results.length === 0) {
            console.log('⚠️  No results found\n');
        } else {
            console.log('✅ Query Results:\n');
            console.table(results);
            console.log(`\n📊 Total Rows: ${results.length}\n`);
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await sequelize.close();
    }
}

// 💡 Change this query as needed
const myQuery = 'SELECT id, name, phone, role, flatNumber, wing FROM Users';

console.log('🔍 Executing Query:', myQuery, '\n');
runQuery(myQuery);
