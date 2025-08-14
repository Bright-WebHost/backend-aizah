  const mongoose =require('mongoose');
const {Schema} =mongoose;


const DateSelect= new Schema({
    checkIn:{
        type:Date,
    },
    checkOut:{
        type:Date,
    },
    currentDate:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model("Date",DateSelect)