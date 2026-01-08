const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController'); // Import the whole object
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, visitorController.logVisitor); // Use existing property
router.get('/', authMiddleware, visitorController.getLogs);   // Use existing property
router.get('/export', visitorController.exportVisitors); // Add new export route. Consider adding authMiddleware if needed.

module.exports = router;
