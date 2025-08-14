const mongoose =require('mongoose');
require('dotenv').config();
const mongoUrl=process.env.MONGO_URL;


const   connectMongoDb =async()=>{
    try{
        await mongoose.connect(mongoUrl);
      console.log("Connect Database");

    }
    catch(err){
        console.log("Not Connect Data base",err);
    }
}
module.exports=connectMongoDb;