const User = require("../models/user");
const attendance = require("../models/Attendance");
const Attendance = require("../models/Attendance");

const EmployeeDetails = async (req, res) => {
  try {
    const countEmployee = await User.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presentEmployee = await Attendance.aggregate([
      {
        $match: {
          clockIn: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'result'
        }
      },
      {
        $count: "totalPresent"
      }
    ]);

    const totalPresent = presentEmployee[0]?.totalPresent || 0;
    const absentees = countEmployee - totalPresent;
    // console.log(countEmployee, totalPresent, absentees)
    return res.status(200).json({
      message: "Successfully fetched",
      totalEmployees: countEmployee,
      presentToday: totalPresent,
      absentToday: absentees
    });
  } catch (err) {
    console.error('Error in EmployeeDetails:', err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


module.exports = EmployeeDetails;