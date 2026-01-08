const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './society.db',
    logging: false
});

async function addColumn() {
    try {
        await sequelize.query("ALTER TABLE VisitorLogs ADD COLUMN visitorPhone VARCHAR(255) DEFAULT 'Not Specified';");
        console.log('Column added successfully');
    } catch (err) {
        if (err.message.includes('duplicate column')) {
            console.log('Column already exists');
        } else {
            console.error(err);
        }
    }
}

addColumn();
