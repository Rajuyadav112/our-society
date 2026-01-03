const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Notice = sequelize.define("Notice", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    postedBy: {
        type: DataTypes.STRING,
        defaultValue: "Admin"
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Notice;
