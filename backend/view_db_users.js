const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './society.db',
    logging: false
});

const User = sequelize.define('User', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
}, { tableName: 'Users' });

async function showUsers() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({
            attributes: ['name', 'phone', 'password', 'role'],
            raw: true
        });

        console.log('\n--- User List in Database ---');
        console.table(users);
        console.log('\nNote: Passwords starting with "$2a$" or "$2b$" are encrypted (hashed) for security.');
    } catch (err) {
        console.error('Error viewing users:', err.message);
    } finally {
        await sequelize.close();
    }
}

showUsers();
