const mongoose = require('mongoose');

const HolidaysSchema = new mongoose.Schema({
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    EventName:{type:String},
})
module.exports = mongoose.model('Holiday', HolidaysSchema);