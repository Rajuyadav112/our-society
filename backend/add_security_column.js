const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './society.db',
    logging: console.log
});

async function addColumn() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        // Check if column exists
        const [results] = await sequelize.query("PRAGMA table_info(Users);");
        const hasColumn = results.some(col => col.name === 'securityId');

        if (hasColumn) {
            console.log('ℹ️ Column securityId already exists.');
        } else {
            console.log('🔄 Adding securityId column...');
            await sequelize.query("ALTER TABLE Users ADD COLUMN securityId TEXT;");
            console.log('✅ Column securityId added successfully.');
        }

    } catch (error) {
        console.error('❌ Error updating database:', error);
    } finally {
        await sequelize.close();
    }
}

addColumn();
