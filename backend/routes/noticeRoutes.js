const express = require('express');
const router = express.Router();
const { getNotices, createNotice, addComment, deleteComment, deleteNotice } = require('../controllers/noticeController');
const auth = require('../middleware/auth'); // Ensure auth is imported if you want protection

// Assuming auth middleware is desired for these
router.get('/', auth, getNotices);
router.post('/', auth, createNotice);
router.post('/:noticeId/comments', auth, addComment);
router.delete('/comments/:commentId', auth, deleteComment);
router.delete('/:noticeId', auth, deleteNotice);

module.exports = router;
