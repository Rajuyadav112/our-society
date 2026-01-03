const express = require("express");
const router = express.Router();
const { getUsersOverview } = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.get("/overview", auth, getUsersOverview);

module.exports = router;
