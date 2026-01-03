const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");

const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const recipientId = req.params.recipientId;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId, receiverId: recipientId },
                    { senderId: recipientId, receiverId: userId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({ error: "Receiver and content are required" });
        }

        const message = await Message.create({
            senderId,
            receiverId,
            content
        });

        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send message" });
    }
};

module.exports = {
    getMessages,
    sendMessage
};
