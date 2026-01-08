const User = require('./models/user');
const sequelize = require('./config/db');

async function testRegister() {
    try {
        await sequelize.authenticate();
        const phone = '8888888888';
        const name = 'Test Watchman';
        const securityId = 'SEC-TEST';

        // Cleanup
        await User.destroy({ where: { phone } });

        const user = await User.create({
            name,
            phone,
            role: 'watchman',
            securityId
        });

        console.log('Created User:', user.toJSON());

        // Re-fetch to verify persistence
        const fetched = await User.findOne({ where: { phone } });
        console.log('Fetched SecurityID:', fetched.securityId);

    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}
testRegister();
