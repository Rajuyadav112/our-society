const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Logger - VERY TOP
app.use((req, res, next) => {
  console.log(`[RAW] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Import models so Sequelize registers them
const User = require('./models/user');
const Notice = require('./models/notice');
const Complaint = require('./models/complaint');
const Bill = require('./models/bill');
const VisitorLog = require('./models/visitorLog');
const NoticeComment = require('./models/noticeComment');
const Message = require('./models/message');

// Associations
User.hasMany(NoticeComment, { foreignKey: 'userId' });
NoticeComment.belongsTo(User, { foreignKey: 'userId' });

Notice.hasMany(NoticeComment, { foreignKey: 'noticeId', onDelete: 'CASCADE' });
NoticeComment.belongsTo(Notice, { foreignKey: 'noticeId' });

User.hasMany(VisitorLog, { foreignKey: 'watchmanId', as: 'LoggedEntry' });
VisitorLog.belongsTo(User, { foreignKey: 'watchmanId', as: 'Watchman' });

// Message Associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

// Routes
const userRoutes = require("./routes/userRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const billRoutes = require("./routes/billRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use('/api/users', userRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Society App Backend Running 🚀' });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    await sequelize.sync();
    console.log('All models synced');

    app.listen(PORT, '0.0.0.0', () => {
      const { networkInterfaces } = require('os');
      const nets = networkInterfaces();
      let localIP = 'localhost';
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
            localIP = net.address;
          }
        }
      }
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Network URL: http://${localIP}:${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

start();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
