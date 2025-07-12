const mongoose =require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    name: {
        type:String, 
    },
    phone: {
        type:String,
       
    },
      start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  },
  calendar: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
})
module.exports = mongoose.model('testData',userSchema);
