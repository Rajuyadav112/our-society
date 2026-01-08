const VisitorLog = require('./models/visitorLog');
const User = require('./models/user');
const sequelize = require('./config/db');

// Define associations manually since they are defined in index.js usually
VisitorLog.belongsTo(User, { foreignKey: 'watchmanId', as: 'Watchman' });

async function viewVisitors() {
    try {
        const logs = await VisitorLog.findAll({
            order: [['entryTime', 'DESC']],
            include: [{ model: User, as: 'Watchman', attributes: ['name'] }],
            raw: true,
            nest: true
        });

        if (logs.length === 0) {
            console.log("No visitor logs found.");
        } else {
            console.table(logs.map(log => ({
                Name: log.visitorName,
                Phone: log.visitorPhone,
                Purpose: log.purpose,
                Flat: `${log.wing}-${log.flatNumber}`,
                Watchman: log.Watchman ? log.Watchman.name : 'N/A',
                Time: log.entryTime.toLocaleString()
            })));
        }
    } catch (error) {
        console.error("Error fetching visitors:", error);
    } finally {
        await sequelize.close();
    }
}

viewVisitors();
