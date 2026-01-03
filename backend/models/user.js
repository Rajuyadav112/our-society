const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "resident" // can be 'resident', 'admin', 'watchman'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "approved" // 'pending', 'approved', 'rejected'
    },
    // New Fields
    flatOwnerName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    flatNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    wing: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profilePicture: {
        type: DataTypes.STRING, // Store URL or Path
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true // Optional for now, but should be required for new users
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otpExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = User;
