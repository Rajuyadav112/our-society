const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, replyToComplaint } = require('../controllers/complaintController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getComplaints);
router.post('/', upload.single('image'), createComplaint);
router.put('/:id/reply', replyToComplaint);
router.delete('/:id', authMiddleware, require('../controllers/complaintController').deleteComplaint);

module.exports = router;
