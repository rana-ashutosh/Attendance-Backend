const express = require('express');
const {clockIn, clockOut, startBreak, endBreak } = require('../controllers/AttentdenceController');
const router = express.Router();

router.post('/clock-in/:userId', clockIn);
router.post('/clock-out/:userId', clockOut)
router.post('/startBreak', startBreak)
router.post('/endBreak', endBreak)

module.exports = router;