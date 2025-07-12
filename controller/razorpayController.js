

const express =require('express');
const app=express();
app.use(express.json());
const Razorpay =require('../model/Razorpay')





// insret value;
const Keyinsert= async(req,res)=>{
    try{
        const {key }=req.body
       const data=await new Razorpay({key});
       const saveData= await data.save();
        // console.log("Insertion Successfully")
          res.send({"Insertion success":true,saveData})
    }
    catch(err){
        console.log("please check");
            res.status(500).json({ success: false, message: "Internal server error" });
       

    }
}

const KeyView=async (req,res) => {
    try{
        const data=await Razorpay.find();
        // const dataSave=await data.save();
        res.send({"Razorpay Key view":true,data})


    }
    catch(error){
        console.log("Razorpay view error");
        res.status(500).json({success:true,message:'Razorpay view error'})
        
    }
    
}


const KeyUpdate = async (req, res) => {
    const {key } = req.body;

    try {
        const newData = {};
        if (key) newData.key = key;
       

        console.log("Updating key:", req.params.id);
        console.log("New key:", newData);

        const data = await Razorpay.findById(req.params.id);
        if (!data) {
            return res.status(404).send("Data does not exist with this ID!");
        }

        const updated = await Razorpay.findByIdAndUpdate(
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

module.exports={Keyinsert,KeyView,KeyUpdate};