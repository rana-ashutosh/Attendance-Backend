const mongoose = require('mongoose');

const LeavesSchema = new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:{type: String},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    reason:{type:String},
    leaveType:{type:String},
})
module.exports = mongoose.model('Leaves', LeavesSchema);