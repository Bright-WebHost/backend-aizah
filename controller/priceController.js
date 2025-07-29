const express =require('express');
const app=express();
app.use(express.json());
const RoomPrice = require('../model/roomPriceSchema');

// Insert new room price data
const priceInsert = async (req, res) => {
  try {
    const { roomName, prices } = req.body;

    if (!roomName || !prices) {
      return res.status(400).json({ error: "Missing roomName or prices" });
    }

    const allMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const fullPrices = allMonths.reduce((acc, month) => {
      acc[month] = prices[month] || { basePrice: 0, ranges: [] };
      return acc;
    }, {});

    const newRoomPrice = new RoomPrice({
      roomName,
      prices: fullPrices
    });

    const result = await newRoomPrice.save();
    res.status(201).json(result);
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).json({ 
      error: "Failed to insert prices", 
      details: err.message 
    });
  }
};

// View room price by ID
const priceView = async (req, res) => {
  try {
    const id = req.params.id;
    const room = await RoomPrice.findById(id);
    
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update room price by roomName
const priceUpdate = async (req, res) => {
  try {
    const { roomName, prices } = req.body;

    if (!roomName || !prices) {
      return res.status(400).json({ error: "Missing roomName or prices" });
    }

    const allMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const fullPrices = allMonths.reduce((acc, month) => {
      acc[month] = prices[month] || { basePrice: 0, ranges: [] };
      return acc;
    }, {});

    const updated = await RoomPrice.findOneAndUpdate(
      { roomName },
      { prices: fullPrices, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ 
      error: "Failed to update prices",
      details: err.message 
    });
  }
};
// Delete a specific date range from a month's pricing
const priceRangeDelete = async (req, res) => {
  try {
    const { roomName, month, startDate, endDate } = req.body;

    if (!roomName || !month || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing roomName, month, startDate, or endDate" });
    }

    const updated = await RoomPrice.findOneAndUpdate(
      { roomName },
      {
        $pull: {
          [`prices.${month}.ranges`]: {
            startDate: startDate,
            endDate: endDate
          }
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Room not found or update failed" });
    }

    res.status(200).json({ message: "Range deleted successfully", data: updated });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ 
      error: "Failed to delete date range",
      details: err.message 
    });
  }
};

module.exports = { priceInsert, priceView, priceUpdate ,priceRangeDelete};
