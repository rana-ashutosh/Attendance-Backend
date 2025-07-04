const Attendance = require("../models/Attendance");
const moment = require('moment');
const mongoose = require('mongoose');

const getTodayDate = () => moment().format('YYYY-MM-DD');

const clockIn = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const today = getTodayDate();
    console.log(today)
    const existing = await Attendance.findOne({ userId, date: today });
    if (existing) return res.status(400).json({ message: 'Already clocked in' });

    const attendance = new Attendance({
      userId,
      date: today,
      clockIn: new Date(),
    });

    const result = await attendance.save();
    console.log("==", result);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const clockOut = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const today = getTodayDate();

    const existing = await Attendance.findOne({ userId, date: today });
    
    if (existing && existing.clockIn && !existing.clockOut) {
      existing.clockOut = new Date(); 
      const result = await existing.save(); 
      console.log(result);
      return res.status(200).json(result);
    } else if (existing && existing.clockOut) {
      return res.status(400).json({ message: "Already clocked out." });
    } else {
      return res.status(404).json({ message: "Clock-in not found for today." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const startBreak = async (req, res) => {
  try {
    const { userId,  startTime, todayDate } = req.body;
    console.log(req.body)

    const attendance = await Attendance.findOne({ userId: userId});

    console.log(attendance)

    if (!attendance && attendance.date.moment().format('YYYY-MM-DD') === todayDate) {
      return res.status(401).json({ message: "You have to clock in first" });
    }

    const hasUnfinishedBreak = attendance.breaks.some(
      (b) => b.startTime && !b.endTime
    );

    if (hasUnfinishedBreak) {
      return res.status(401).json({ message: "You have to end the previous break first" });
    }

    attendance.breaks.push({
      startTime: startTime || new Date().toISOString(), 
    });

    await attendance.save();

    res.status(200).json({ message: "Break started", data: attendance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
const endBreak = async (req, res) => {
  try {
    const { userId, endTime, todayDate } = req.body;

    const attendance = await Attendance.findOne({ userId: userId, clockIn: todayDate });

    if (!attendance) {
      return res.status(401).json({ message: "You have to clock in first" });
    }

    if (!attendance.breaks || !attendance.breaks.length) {
      return res.status(400).json({ message: "You didn't start a break yet" });
    }

    const ongoingBreak = attendance.breaks.find(b => b.startTime && !b.endTime);

    if (!ongoingBreak) {
      return res.status(400).json({ message: "You have to start a break first" });
    }

    const end = new Date(endTime )|| new Date().toISOString();
    const start = new Date(ongoingBreak.startTime);


    const durationMs = end - start;
    const seconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const durationStr = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    ongoingBreak.endTime = end;
    ongoingBreak.duration = durationStr;

    await attendance.save();

    res.status(200).json({ message: "Break ended", data: attendance });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = { clockIn, clockOut, startBreak, endBreak };