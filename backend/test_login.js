const User = require('./models/user');
const sequelize = require('./config/db');

async function testLoginLogic() {
    try {
        await sequelize.authenticate();

        const phone = '9999999999'; // Assuming this is the watchman's phone
        const enteredPass = 'SEC-9999'; // The exact string from previous logs

        const user = await User.findOne({ where: { phone } });

        if (!user) {
            console.log('User not found');
            return;
        }

        console.log(`Role: ${user.role}`);
        console.log(`Stored SecurityID: '${user.securityId}' (Type: ${typeof user.securityId})`);
        console.log(`Entered Password: '${enteredPass}' (Type: ${typeof enteredPass})`);

        if (user.securityId !== enteredPass) {
            console.log('❌ STRICT MATCH FAILED');
        } else {
            console.log('✅ STRICT MATCH PASSED');
        }

        if (user.securityId == enteredPass) {
            console.log('✅ LOOSE MATCH PASSED');
        } else {
            console.log('❌ LOOSE MATCH FAILED');
        }

        // Check for hidden characters
        console.log('Stored bytes:', Buffer.from(user.securityId));
        console.log('Entered bytes:', Buffer.from(enteredPass));


    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

testLoginLogic();
