const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './society.db',
    logging: false
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    phone: DataTypes.STRING,
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
    flatOwnerName: DataTypes.STRING,
    flatNumber: DataTypes.STRING,
    wing: DataTypes.STRING,
    password: DataTypes.STRING
}, { tableName: 'Users' });

async function quickView() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({
            attributes: ['id', 'name', 'phone', 'role', 'flatNumber', 'wing'],
            raw: true
        });

        if (users.length === 0) {
            console.log('\n⚠️  Koi user nahi hai database mein.');
            console.log('💡 Frontend se signup karein pehle.\n');
        } else {
            console.log(`\n✅ Total Users: ${users.length}\n`);
            console.table(users);
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await sequelize.close();
    }
}

quickView();
