const sequelize = require('./config/db');
const User = require('./models/user');

async function createWatchman() {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        // Create or update watchman user
        const [watchman, created] = await User.findOrCreate({
            where: { phone: '9999999999' },
            defaults: {
                phone: '9999999999',
                name: 'Security Guard',
                role: 'watchman',
                status: 'approved',
                securityId: 'SEC-1234'
            }
        });

        if (!created) {
            // Update securityId if user already exists
            watchman.securityId = 'SEC-1234';
            await watchman.save();
            console.log('🔄 Watchman updated with Security ID');
        } else {
            console.log('✅ Watchman created successfully!');
        }

        console.log('\n📱 Watchman Login Credentials:');
        console.log('Phone: 9999999999');
        console.log('Password: (No password required for now - just enter the phone number)');
        console.log('\n🔐 To add password protection, you can update the user in the database');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createWatchman();
