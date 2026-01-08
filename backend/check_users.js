const User = require('./models/user');
const sequelize = require('./config/db');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const users = await User.findAll();
        console.log('Total users:', users.length);

        users.filter(u => u.phone === '9999999999').forEach(u => {
            console.log(`ID: ${u.id}, Phone: ${u.phone}, Role: ${u.role}, SecurityID: ${u.securityId}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

checkUsers();
