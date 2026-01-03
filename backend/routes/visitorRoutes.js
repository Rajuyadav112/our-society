const express = require('express');
const router = express.Router();
const { logVisitor, getLogs } = require('../controllers/visitorController');
const auth = require('../middleware/auth');

router.post('/', auth, logVisitor);
router.get('/', auth, getLogs);

module.exports = router;
