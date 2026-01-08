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
    profilePicture: DataTypes.STRING,
    password: DataTypes.STRING,
    otp: DataTypes.STRING,
    otpExpires: DataTypes.DATE,
    lastSeen: DataTypes.DATE
}, { tableName: 'Users' });

async function showAllUsers() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully!\n');

        const users = await User.findAll({
            raw: true
        });

        if (users.length === 0) {
            console.log('⚠️  Database mein koi user nahi hai abhi.\n');
            console.log('💡 Users tab create honge jab koi signup karega.\n');
        } else {
            console.log(`📊 Total Users: ${users.length}\n`);
            console.log('--- Complete User Details ---\n');

            users.forEach((user, index) => {
                console.log(`\n👤 User ${index + 1}:`);
                console.log(`   ID: ${user.id}`);
                console.log(`   Name: ${user.name || 'Not set'}`);
                console.log(`   Phone: ${user.phone}`);
                console.log(`   Password: ${user.password ? (user.password.startsWith('$2') ? '🔒 Encrypted' : user.password) : 'Not set'}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Status: ${user.status}`);
                console.log(`   Flat Owner: ${user.flatOwnerName || 'Not set'}`);
                console.log(`   Flat Number: ${user.flatNumber || 'Not set'}`);
                console.log(`   Wing: ${user.wing || 'Not set'}`);
                console.log(`   Profile Picture: ${user.profilePicture || 'Not set'}`);
                console.log(`   Last Seen: ${user.lastSeen || 'Not set'}`);
                console.log('   ' + '-'.repeat(50));
            });

            console.log('\n📝 Note: Passwords starting with "$2a$" or "$2b$" are encrypted for security.');
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await sequelize.close();
    }
}

showAllUsers();
