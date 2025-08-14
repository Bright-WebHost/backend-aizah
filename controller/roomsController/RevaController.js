const {json}=require('express');
const express =require('express');
// const Checkout=require('../model/Checkout');
const RevaSchema=require('../../model/roomsSchema/RevaSchema')



const ReavaInsert=async(req,res)=>{

    try{
          const {checkin,checkout,adults,Children,fname,lname,email,phone,city,code,guests,night,totalprice,paymentID,children,price,roomname,postbook}=req.body;
          const data=await new RevaSchema({checkin,checkout,adults,Children,fname,lname,email,phone,city,code,guests,night,totalprice,paymentID,children,price,roomname,postbook});
          const saveData=await data.save();
          res.send({"Checkout insert success":true,saveData})


    }
    catch(error){
        console.log("checkout insert error");
        res.status(500).json({success:fal,message:'checkout not insert'})
        

    }
  
}


const ReavaView=async (req,res) => {
    try{
        const data=await RevaSchema.find();
        // const dataSave=await data.save();
        res.send({"checkout view success":true,data})


    }
    catch(error){
        console.log("checkout view error");
        res.status(500).json({success:true,message:'checkout view error'})
        
    }
    
}
const ReavaUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkin, checkout, postbook } = req.body;

        // Debugging: Log the received data
        console.log('Received update request:', { id, checkin, checkout, postbook });

        // Validate required fields
        if (!checkin || !checkout) {
            console.log('Validation failed - missing dates');
            return res.status(400).json({ 
                success: false, 
                message: 'checkin and checkout dates are required',
                receivedData: req.body // Include received data for debugging
            });
        }

        // Update only the specified fields
        const updatedData = await RevaSchema.findByIdAndUpdate(
            id,
            { 
                $set: { 
                    checkin: new Date(checkin),
                    checkout: new Date(checkout),
                    postbook: postbook || false
                } 
            },
            { new: true }
        );

        if (!updatedData) {
            console.log('Booking not found with id:', id);
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }

        console.log('Successfully updated booking:', updatedData);
        res.json({ 
            success: true, 
            updatedData 
        });
    } catch (error) {
        console.error("Update checkout dates error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update booking dates',
            error: error.message 
        });
    }
};



const ReavaDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await RevaSchema.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ success: false, message: "Checkout not found" });
    }

    res.json({ success: true, message: "Checkout deleted successfully", deletedData });
  } catch (error) {
    console.error("Checkout delete error:", error);
    res.status(500).json({ success: false, message: "Server error during delete" });
  }
};



module.exports={ReavaInsert,ReavaView,ReavaUpdate,ReavaDelete};