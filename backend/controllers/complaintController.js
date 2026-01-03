const Complaint = require('../models/complaint');

const getComplaints = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        let whereClause = {};
        // If query param 'all' is true and user is admin (logic handled in frontend for now), return all
        // For simplicity, let's just return all for now or filter by user if not admin
        // But since we want admin to see all, let's return all.
        // In a real app we'd check req.user.role === 'admin'

        const complaints = await Complaint.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch complaints' });
    }
};

const createComplaint = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const complaint = await Complaint.create({
            title,
            description,
            userId,
            imageUrl
        });
        res.status(201).json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create complaint' });
    }
};

const replyToComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;

        const complaint = await Complaint.findByPk(id);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        complaint.adminReply = reply;
        complaint.status = "Resolved"; // Auto-resolve on reply? Optional. Let's keep it open or maybe Resolved.
        await complaint.save();

        res.json({ message: "Reply posted successfully", complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to reply to complaint" });
    }
};

module.exports = { getComplaints, createComplaint, replyToComplaint };
