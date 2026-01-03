const express = require('express');
const router = express.Router();
const { getBills, createBill, sendBillReminders } = require('../controllers/billController');

router.get('/', getBills);
router.post('/', createBill);
router.post('/reminders', sendBillReminders);

module.exports = router;
