const { DataTypes } = require("sequelize");
const sequelize = require("./config/db");
const User = require("./models/user");

const phone = process.argv[2];

if (!phone) {
    console.error("Please provide a phone number: node setAdmin.js <phone_number>");
    process.exit(1);
}

async function setAdmin() {
    try {
        await sequelize.authenticate();
        console.log("Connected to database...");

        const user = await User.findOne({ where: { phone } });
        if (!user) {
            console.error(`User with phone ${phone} not found! Register first.`);
            process.exit(1);
        }

        user.role = "admin";
        await user.save();
        console.log(`✅ Success! User ${user.name} (${phone}) is now an ADMIN.`);
    } catch (error) {
        console.error("Error updating user:", error);
    } finally {
        await sequelize.close();
    }
}

setAdmin();
