// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  clockIn: Date,
  clockOut: Date,
  totalWorkDuration: Number,
  breaks: [
    {
      startTime: {
        type: String,
        required: false,
      },
      endTime: {
        type: String,
        required: false,
      },
      duration: {
        type: String,
        required: false,
      }
    }
  ]
});

module.exports = mongoose.model('Attendance', attendanceSchema);
