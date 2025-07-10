const cron = require('node-cron');
const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');

function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

const resetAttendance = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1); 

            const result = await Attendance.updateMany(
                {
                    date: { $gte: today, $lt: tomorrow },
                },
                {

                    $set: { clockIn: null, clockOut: null, date:null }
                }
            );
            // const result = await Attendance.updateMany(
            //     {
            //         userId: new mongoose.Types.ObjectId('6863b8b278d1d0bdaee9ab70')
            //     },
            //     {

            //         $set: { clockIn: null, clockOut: null }
            //     }
            // );

            console.log(`Attendance reset at 12 AM. Updated: ${result}`);
        } catch (err) {
            console.error('Error during attendance reset:', err.message);
        }
    });
};

module.exports = resetAttendance;
