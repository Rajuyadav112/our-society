const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Setup DB connection to verify side effects directly
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'backend', 'society.db'),
    logging: false
});

const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "resident" },
    securityId: { type: DataTypes.STRING, allowNull: true, unique: true }
});

const Message = sequelize.define("Message", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    receiverId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true }
});

const BASE_URL = 'http://localhost:5001/api/users';
const TEST_PHONE = '9988776655';

async function runTest() {
    try {
        console.log("🚀 Starting Security Flow Test...");

        // 1. Cleanup previous test data
        await User.destroy({ where: { phone: TEST_PHONE } });

        // Ensure Admin exists for notification
        let admin = await User.findOne({ where: { role: 'admin' } });
        if (!admin) {
            console.log("ℹ️ Creating temporary admin for test...");
            admin = await User.create({
                name: 'Test Admin',
                phone: '0000000000',
                role: 'admin'
            });
        }
        console.log(`✅ Admin exists (ID: ${admin.id})`);

        // 2. Register Security User (Role: Watchman)
        console.log("\n📡 Testing Registration...");
        const registerRes = await axios.post(`${BASE_URL}/security-register`, {
            name: 'Test Guard',
            phone: TEST_PHONE
        });

        if (registerRes.data.message === "Security registered successfully") {
            console.log("✅ Registration API Success");
        } else {
            console.error("❌ Registration API Verification Failed", registerRes.data);
            return;
        }

        const securityId = registerRes.data.securityId;
        console.log(`ℹ️ Generated Security ID: ${securityId}`);

        // 3. Verify Admin Notification
        const message = await Message.findOne({
            order: [['createdAt', 'DESC']],
            where: { receiverId: admin.id }
        });

        if (message && message.content.includes(securityId)) {
            console.log("✅ Admin Notification Found in DB");
            console.log(`   Content: ${message.content.split('\n')[0]}...`);
        } else {
            console.error("❌ Admin Notification NOT Found in DB");
        }

        // 4. Test Login (Failure Case - Wrong ID)
        console.log("\n🔐 Testing Login (Invalid Creds)...");
        try {
            await axios.post(`${BASE_URL}/login`, {
                phone: TEST_PHONE,
                password: 'WRONG_ID'
            });
            console.error("❌ Failed Login verification (Should have failed but succeeded)");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log("✅ Invalid ID correctly rejected (401)");
            } else {
                console.error(`❌ Unexpected error: ${err.message}`);
            }
        }

        // 5. Test Login (Success Case)
        console.log("\n🔐 Testing Login (Valid Creds)...");
        try {
            const loginRes = await axios.post(`${BASE_URL}/login`, {
                phone: TEST_PHONE,
                password: securityId
            });
            if (loginRes.data.token) {
                console.log("✅ Login Successful with Security ID");
            } else {
                console.error("❌ Login response missing token");
            }
        } catch (err) {
            console.error(`❌ Login failed: ${err.response?.data?.error || err.message}`);
        }

        console.log("\n🎉 Test Completed!");

    } catch (error) {
        console.error("\n❌ Test Failed:", error.message);
        if (error.response) console.error("Response:", error.response.data);
    }
}

runTest();
