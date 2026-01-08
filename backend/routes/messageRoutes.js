const express = require("express");
const router = express.Router();
const {
    getMessages,
    sendMessage,
    reactToMessage,
    markMessagesAsRead,
    getUnreadCounts
} = require("../controllers/messageController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/unread-counts", auth, getUnreadCounts);
router.get("/:recipientId", auth, getMessages);
router.post("/send", auth, upload.single('image'), sendMessage);
router.post("/:messageId/react", auth, reactToMessage);
router.put("/mark-read/:senderId", auth, markMessagesAsRead);

module.exports = router;
