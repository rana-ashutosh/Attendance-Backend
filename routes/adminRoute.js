const express = require('express');
const EmployeeDetails = require('../controllers/adminController');
const router = express.Router();

router.get('/totalusers', EmployeeDetails)

module.exports = router;