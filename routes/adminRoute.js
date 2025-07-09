const express = require('express');
const {EmployeeDetails,makeNewLeave,makeNewHoliday,updateLeaveStatus,getAllLeaves,getAllHolidays,getLeavesById, userLeaves} = require('../controllers/adminController');
const router = express.Router();

router.get('/totalusers', EmployeeDetails)
router.post('/registerleave', makeNewLeave)
router.post('/updateleave', updateLeaveStatus)
router.post('/registerholiday', makeNewHoliday)
router.get('/getallleaves',getAllLeaves)
router.get('/getleaves/:userId',getLeavesById)
router.get('/getholidays',getAllHolidays)
router.get('/userLeaves/:userId',userLeaves )

module.exports = router;