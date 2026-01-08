const sequelize = require('./config/db');
const User = require('./models/user');
const Message = require('./models/message');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const tableConfigs = [
            { name: 'Users', model: User },
            { name: 'Messages', model: Message }
        ];

        for (const { name, model } of tableConfigs) {
            const [results] = await sequelize.query(`PRAGMA table_info(${name});`);
            const dbCols = results.map(r => r.name);
            console.log(`\nTable: ${name}`);
            console.log(`DB Columns: ${dbCols.join(', ')}`);

            const modelCols = Object.keys(model.rawAttributes);
            // Sequelize adds createdAt/updatedAt automatically
            if (model.options.timestamps !== false) {
                if (!modelCols.includes('createdAt')) modelCols.push('createdAt');
                if (!modelCols.includes('updatedAt')) modelCols.push('updatedAt');
            }
            console.log(`Model Columns: ${modelCols.join(', ')}`);

            const missing = modelCols.filter(c => !dbCols.includes(c));
            if (missing.length > 0) {
                console.error(`!!! MISSING IN DB: ${missing.join(', ')}`);
            } else {
                console.log('All model columns exist in DB');
            }
        }
    } catch (e) {
        console.error('Check failed:', e);
    } finally {
        await sequelize.close();
    }
}

check();
