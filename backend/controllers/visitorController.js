const VisitorLog = require('../models/visitorLog');
const User = require('../models/user');

const logVisitor = async (req, res) => {
    try {
        const { visitorName, purpose, flatNumber, wing } = req.body;
        const watchmanId = req.user.id;

        const log = await VisitorLog.create({
            visitorName,
            purpose,
            flatNumber,
            wing,
            watchmanId
        });

        res.status(201).json(log);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to log visitor' });
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await VisitorLog.findAll({
            order: [['entryTime', 'DESC']],
            include: [{ model: User, as: 'Watchman', attributes: ['name'] }]
        });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch visitor logs' });
    }
};

module.exports = { logVisitor, getLogs };
