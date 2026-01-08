const User = require("../models/user");
const Bill = require("../models/bill");
const Complaint = require("../models/complaint");
const { Op } = require("sequelize");

const getUsersOverview = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied" });
        }

        const users = await User.findAll({
            where: {
                role: ['resident', 'watchman']
            },
            attributes: ['id', 'name', 'phone', 'wing', 'flatNumber', 'flatOwnerName', 'profilePicture', 'role', 'status']
        });

        // For each user, count pending bills and open complaints
        const overview = await Promise.all(users.map(async (user) => {
            const pendingBills = await Bill.count({
                where: {
                    userId: user.id,
                    status: 'Pending'
                }
            });

            const openComplaints = await Complaint.count({
                where: {
                    userId: user.id,
                    status: 'Open'
                }
            });

            return {
                ...user.toJSON(),
                pendingBills,
                openComplaints
            };
        }));

        res.json(overview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users overview" });
    }
};

module.exports = {
    getUsersOverview
};
