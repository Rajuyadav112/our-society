const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/messageController");
const auth = require("../middleware/auth");

router.get("/:recipientId", auth, getMessages);
router.post("/send", auth, sendMessage);

module.exports = router;
