const User = require("../models/user");
const Attendance = require("../models/Attendance");
const Holiday = require("../models/Admin/Holidays");
const Leave = require("../models/Admin/Leaves");

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

const makeNewLeave = async (req, res) => {
  try {
    console.log(req.body)
    const { userId, startDate, endDate, reason, leaveType } = req.body
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(400).json({ "message": "user not found" })
    }
    const newLeave = new Leave({ userId, startDate, endDate, reason, leaveType,status:"Pending" });
    await newLeave.save();
    res.status(200).json({ "message": "leave has been registered" })
  }
  catch {
    res.json({ "message": "something went wrong" })
  }
}

const getAllLeaves=async(req,res)=>{
  try{
    const allLeaves = await Leave.find().populate("userId")
    if(allLeaves){
      return res.status(200).json({allLeaves,"message":"got the data"})
    }
    else{
      
      return res.status(404).json({allLeaves,"message":"no data found"})
    }
  }
  catch{
    res.status(401).json({"message":"something went wrong "})
  }
}

const getLeavesById = async(req,res)=>{
   try{
    const {userId} = req.params.userId;
    const allLeaves = await Leave.find({userId:userId})
    if(allLeaves){
      return res.status(200).json({allLeaves,"message":"got the data"})
    }
    else{
      
      return res.status(404).json({allLeaves,"message":"no data found"})
    }
  }
  catch{
    res.status(401).json({"message":"something went wrong "})
  }
}

const getAllHolidays=async(req,res)=>{
  try{
    const allHolidays = await Holiday.find()
    if(allHolidays){
      return res.status(200).json({allHolidays,"message":"got the data"})
    }
    else{
      
      return res.status(404).json({allHolidays,"message":"no data found"})
    }
  }
  catch{
    res.status(401).json({"message":"something went wrong "})
  }
}

const updateLeaveStatus = async (req,res)=>{
  try{
    const {leaveId,status} = req.body
    console.log(leaveId,status)

    const existingLeave = await Leave.findOne({_id:leaveId})
      if(!existingLeave){
      return res.status(400).json({ "message": "leave not found" })
      }

    existingLeave.status = status;
    await existingLeave.save();
    res.status(200).json({ message: "Leave status updated successfully", leave: existingLeave });

  }
  catch{
    res.json({ "message": "something went wrong" })
  }  
}

const makeNewHoliday = async (req,res)=>{
   try {
    const {startDate, endDate, EventName} = req.body
    const newHoliday = new Holiday({ startDate, endDate, EventName });
    await newHoliday.save();
    res.status(200).json({ "message": "holiday has been registered" })
  }
  catch {
    res.json({ "message": "something went wrong" })
  }
}

const userLeaves = async (req, res)=>{
  const id = req.params.userId
  try{
    const leaves = await Leave.find({userId:id})
    
    res.status(200).json({"message":"Accesed successfully", leaves})
  } catch(err){

  }
}

module.exports = { EmployeeDetails,makeNewLeave,makeNewHoliday,updateLeaveStatus,getAllLeaves,getAllHolidays,getLeavesById,  userLeaves  };