const { getUsersOverview } = require('./controllers/adminController');
const User = require('./models/user');
const sequelize = require('./config/db');

// Mock Req/Res
const req = {
    user: { role: 'admin' }
};
const res = {
    json: (data) => console.log(JSON.stringify(data, null, 2)),
    status: (code) => ({ json: (data) => console.log(`Status ${code}:`, data) })
};

async function test() {
    await sequelize.authenticate();
    await getUsersOverview(req, res);
}

test();
