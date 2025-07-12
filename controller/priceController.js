const express =require('express');
const app=express();
app.use(express.json());
const RoomPrice = require('../model/roomPriceSchema');

const priceInsert = async (req, res) => {
  try {
    console.log("Received body:", req.body); // log incoming data

    const { roomName, prices } = req.body;

    if (!roomName || !prices) {
      return res.status(400).json({ error: "Missing roomName or prices" });
    }

    const result = await RoomPrice.create({ roomName, prices });

    res.status(201).json(result);
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).json({ error: "Failed to insert prices", details: err.message });
  }
};

const priceView = async (req, res) => {
  try {
    const id = req.params.id;
    const room = await RoomPrice.findById(id);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const priceView = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const room = await RoomPrice.findById(id);

//     if (!room) {
//       return res.status(404).json({ success: false, message: "Room not found", data: null });
//     }

//     res.status(200).json({ success: true, data: room });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



const priceUpdate = async (req, res) => {
  const { roomName, prices } = req.body;

  try {
    const updated = await RoomPrice.findOneAndUpdate(
      { roomName },
      { prices, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Room not found. Insert first.' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { priceInsert, priceView,priceUpdate };