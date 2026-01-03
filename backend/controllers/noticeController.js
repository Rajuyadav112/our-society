const Notice = require('../models/notice');

const User = require('../models/user');
const NoticeComment = require('../models/noticeComment');

const getNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll({
            order: [['createdAt', 'DESC']],
            include: [{
                model: NoticeComment,
                include: [{ model: User, attributes: ['name', 'profilePicture'] }]
            }]
        });
        res.json(notices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notices' });
    }
};

const createNotice = async (req, res) => {
    try {
        const { title, content } = req.body;
        // Ideally get postedBy from req.user
        const postedBy = req.user ? req.user.role : 'Admin';
        const notice = await Notice.create({ title, content, postedBy });
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create notice' });
    }
};

const addComment = async (req, res) => {
    try {
        const { noticeId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const comment = await NoticeComment.create({
            noticeId,
            userId,
            content
        });

        // Fetch with user for immediate display
        const commentWithUser = await NoticeComment.findByPk(comment.id, {
            include: [{ model: User, attributes: ['name', 'profilePicture'] }]
        });

        res.status(201).json(commentWithUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const comment = await NoticeComment.findByPk(commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        // Allow if user is author OR user is admin
        if (comment.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await comment.destroy();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};

module.exports = { getNotices, createNotice, addComment, deleteComment };
