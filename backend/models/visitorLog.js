const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VisitorLog = sequelize.define('VisitorLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    visitorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    visitorPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    flatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    wing: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entryTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    exitTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    watchmanId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Specific watchman who logged this
    }
}, {
    timestamps: true
});

module.exports = VisitorLog;
