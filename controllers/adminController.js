const User = require("../models/user");

const EmployeeDetails = async (req, res)=>{
    try{
        const count = await User.countDocuments();
        console.log(count)
        return res.status(200).jsonu
    } catch(err){
        console.log('nooo')
    }
}

module.exports = EmployeeDetails;