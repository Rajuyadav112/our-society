const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, replyToComplaint } = require('../controllers/complaintController');
const upload = require('../middleware/upload');

router.get('/', getComplaints);
router.post('/', upload.single('image'), createComplaint);
router.put('/:id/reply', replyToComplaint);

module.exports = router;
