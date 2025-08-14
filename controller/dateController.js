// const { json } = require('express');
const express =require('express');
const app=express();
app.use(express.json());
const schema = require('../model/schema');
const DateSelect=require('../model/date');
const userSchema =require('../model/schema')



// insret value;
const Insert= async(req,res)=>{
    try{
        const {name,phone }=req.body
       const data=await new schema({name,phone});
       const saveData= await data.save();
        // console.log("Insertion Successfully")
          res.send({"Insertion success":true,saveData})
    }
    catch(err){
        console.log("please check");
            res.status(500).json({ success: false, message: "Internal server error" });
       

    }
}


const View =async(req,res)=>{
    try{
        const data=await schema.find();
    //  res.send({"data":true,data});
     res.json(data)
    }
    catch(err){
             console.error("some error occureed"+error)
        res.status(500).json("some intrnal error!!!")
    }
    

}

const Dateinsert= async(req,res)=>{
    try{
        const {checkIn,checkOut}=req.body;
        const data=await new DateSelect({checkIn,checkOut});
       const dataSave= await data.save();
       res.send({"date insert":true,dataSave})
    }
    catch(err){
          console.error("some error occureed"+error)
        res.status(500).json("some intrnal erroe!!!")
    }
}







// Insert Event
const InsertEvent = async (req, res) => {
  try {
    const { title, start, end, calendar } = req.body;

    // Basic validation
    if (!title || !start || !calendar) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newEvent = new userSchema({ title, start, end, calendar });
    const savedEvent = await newEvent.save();

    // ✅ Correct response - only this one!
    res.status(201).json({ success: true, message: 'Event saved', event: savedEvent });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// ✅ GET - Fetch all events
const GetAllEvents = async (req, res) => {
  try {
    const events = await userSchema.find();
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const UpdateEvent = async (req, res) => {
    const { title, start, end, calendar } = req.body;

    try {
        const newData = {};
        if (title) newData.title = title;
        if (start) newData.start = start;
        if (end) newData.end = end;
        if (calendar) newData.calendar = calendar;

        console.log("Updating ID:", req.params.id);
        console.log("New Data:", newData);

        const data = await userSchema.findById(req.params.id);
        if (!data) {
            return res.status(404).send("Data does not exist with this ID!");
        }

        const updated = await userSchema.findByIdAndUpdate(
            req.params.id,
            { $set: newData },
            { new: true }
        );

        return res.status(200).json({ success: true, updatedData: updated });

    } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).json("Some internal error!");
    }
};



module.exports={Insert,View,Dateinsert,InsertEvent,GetAllEvents,UpdateEvent};
