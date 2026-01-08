const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");
const sequelize = require("../config/db");

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
        console.log("Incoming Message Request:", { body: req.body, file: !!req.file });
        const senderId = req.user.id;
        const { receiverId, content } = req.body;

        let imageUrl = null;
        let fileUrl = null;
        let fileName = null;

        if (req.file) {
            const path = `/uploads/${req.file.filename}`;
            if (req.file.mimetype.startsWith('image/')) {
                imageUrl = path;
            } else {
                fileUrl = path;
                fileName = req.file.originalname;
            }
        }

        if (!receiverId || (!content && !imageUrl && !fileUrl)) {
            console.error("Validation failed: Missing receiverId or content/file", { receiverId, content, imageUrl, fileUrl });
            return res.status(400).json({ error: "Receiver and (content or file) are required" });
        }

        const messageData = {
            senderId,
            receiverId,
            content,
            imageUrl,
            fileUrl,
            fileName
        };
        console.log("Creating message with data:", messageData);

        const message = await Message.create(messageData);

        // Optionally include sender info if needed by frontend immediately
        const sender = await User.findByPk(senderId, { attributes: ['id', 'name', 'profilePicture'] });

        console.log("Message created successfully:", message.id);
        res.json({ ...message.toJSON(), Sender: sender });
    } catch (error) {
        console.error("SendMessage Error:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
};

const reactToMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { reaction } = req.body; // e.g., '❤️', '👍'
        const userId = req.user.id;

        const message = await Message.findByPk(messageId);
        if (!message) return res.status(404).json({ error: "Message not found" });

        let reactions = message.reactions || {};
        const newReactions = { ...reactions, [userId]: reaction }; // Create new object to ensure change detection

        await message.update({ reactions: newReactions });
        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to react to message" });
    }
};

const markMessagesAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { senderId } = req.params;
        console.log(`Marking messages from sender ${senderId} as read for user ${userId}`);

        await Message.update(
            { isRead: true },
            {
                where: {
                    senderId: senderId,
                    receiverId: userId,
                    isRead: false
                }
            }
        );

        res.json({ message: "Messages marked as read" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to mark messages as read" });
    }
};

const getUnreadCounts = async (req, res) => {
    try {
        const userId = req.user.id;
        const unread = await Message.findAll({
            where: { receiverId: userId, isRead: false },
            attributes: ['senderId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['senderId']
        });
        res.json(unread);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch unread counts" });
    }
};

module.exports = {
    getMessages,
    sendMessage,
    reactToMessage,
    markMessagesAsRead,
    getUnreadCounts
};
