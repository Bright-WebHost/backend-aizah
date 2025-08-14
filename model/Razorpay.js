  const mongoose =require('mongoose');
const {Schema} =mongoose;


const Razorpay= new Schema({
    key:{
        type:String
    },
   
})
module.exports=mongoose.model("Razorpay",Razorpay);