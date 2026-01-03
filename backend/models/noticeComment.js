const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Notice = require('./notice');

const NoticeComment = sequelize.define('NoticeComment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true
});

// Associations defined here or in index.js. 
// Ideally in index.js to avoid circular deps during require, 
// but defining foreign keys here ensures they exist on sync if simple.

module.exports = NoticeComment;
