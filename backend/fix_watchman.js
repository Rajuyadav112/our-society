const User = require('./models/user');
const sequelize = require('./config/db');

async function fix() {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { phone: '9999999999' } });
        if (user) {
            user.securityId = 'SEC-9999';
            await user.save();
            console.log('✅ Updated securityId to SEC-9999');
        } else {
            console.log('User not found');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

fix();
