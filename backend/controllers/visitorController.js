const VisitorLog = require('../models/visitorLog');
const User = require('../models/user');
const { Parser } = require('json2csv');

const logVisitor = async (req, res) => {
    try {
        const { visitorName, visitorPhone, purpose, flatNumber, wing } = req.body;
        const watchmanId = req.user.id; // Added consistent watchmanId retrieval 

        const log = await VisitorLog.create({
            visitorName,
            visitorPhone,
            purpose,
            flatNumber,
            wing,
            watchmanId
        });

        res.status(201).json(log);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
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

const exportVisitors = async (req, res) => {
    try {
        const logs = await VisitorLog.findAll({
            order: [['entryTime', 'DESC']],
            include: [{ model: User, as: 'Watchman', attributes: ['name'] }],
            raw: true,
            nest: true
        });

        const fields = [
            { label: 'Visitor Name', value: 'visitorName' },
            { label: 'Phone', value: 'visitorPhone' },
            { label: 'Purpose', value: 'purpose' },
            { label: 'Flat', value: 'flatNumber' },
            { label: 'Wing', value: 'wing' },
            { label: 'Watchman', value: 'Watchman.name' }, // Access nested property
            { label: 'Time', value: row => row.entryTime.toLocaleString() } // Format time
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(logs);

        res.header('Content-Type', 'text/csv');
        res.attachment('visitors.csv');
        return res.send(csv);

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to export visitors' });
    }
};

module.exports = { logVisitor, getLogs, exportVisitors };
