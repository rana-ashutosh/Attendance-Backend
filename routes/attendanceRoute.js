const express = require('express');
const {clockIn, clockOut, startBreak, endBreak, getAttendance } = require('../controllers/AttentdenceController');
const router = express.Router();

router.post('/clock-in/:userId', clockIn);
router.post('/clock-out/:userId', clockOut)
router.post('/startBreak', startBreak)
router.post('/endBreak', endBreak)
router.get('/:userId',getAttendance )

module.exports = router;