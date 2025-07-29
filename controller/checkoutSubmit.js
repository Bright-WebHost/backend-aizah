const {json}=require('express');
const express =require('express');
const CheckoutSubmit=require('../model/CheckoutSubmit');



const CheckoutSubmitInsert=async(req,res)=>{

    try{
          const {roomname,checkin,checkout,adults,Children,fname,lname,email,phone,city,code,guests,night,totalprice,paymentID,children,price}=req.body;
          const data=await new CheckoutSubmit({roomname,checkin,checkout,adults,Children,fname,lname,email,phone,city,code,guests,night,totalprice,paymentID,children,price});
          const saveData=await data.save();
          res.send({"Checkout insert success":true,saveData})


    }
    catch(error){
        console.log("checkout insert error");
        res.status(500).json({success:fal,message:'checkout not insert'})
        

    }
  
}


const CheckoutSubmitView=async (req,res) => {
    try{
        const data=await CheckoutSubmit.find();
        // const dataSave=await data.save();
        res.send({"checkout view success":true,data})


    }
    catch(error){
        console.log("checkout view error");
        res.status(500).json({success:true,message:'checkout view error'})
        
    }
    
}
module.exports={CheckoutSubmitInsert,CheckoutSubmitView};