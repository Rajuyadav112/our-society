const Bill = require('../models/bill');
const User = require('../models/user'); // Ensure we can access user details for notifications

const getBills = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        // If user is admin (check role), return all bills?
        // Or if admin wants to see all bills to send reminders.
        // For now, let's say if admin, fetch all.
        let whereClause = {};
        if (req.user && req.user.role !== 'admin') {
            whereClause = { userId };
        }

        const bills = await Bill.findAll({
            where: whereClause,
            order: [['dueDate', 'ASC']],
            include: [{ model: User, attributes: ['name', 'phone'] }] // Include user info
        });
        res.json(bills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
};

const createBill = async (req, res) => {
    try {
        const { amount, type, dueDate, userId } = req.body;
        const bill = await Bill.create({ amount, type, dueDate, userId });
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create bill' });
    }
};

const sendBillReminders = async (req, res) => {
    try {
        // Fetch all pending bills
        const pendingBills = await Bill.findAll({
            where: { status: 'Pending' },
            include: [{ model: User }]
        });

        // In a real app, we would send SMS/Email here.
        // For now, we just simulate it.
        const notificationsSent = pendingBills.map(bill => ({
            user: bill.User.name,
            amount: bill.amount,
            message: `Reminder sent to ${bill.User.phone}`
        }));

        console.log("SENDING REMINDERS:", notificationsSent);

        res.json({
            message: `Successfully sent reminders to ${notificationsSent.length} residents.`,
            details: notificationsSent
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send reminders" });
    }
}

module.exports = { getBills, createBill, sendBillReminders };
