const express = require('express');
const app=express();
app.use(express.json());
const RoomPrice = require('../model/roomPriceSchema');

// Helper function to validate and prepare price data
const preparePriceData = (prices) => {
  const allMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const fullPrices = {};
  
  allMonths.forEach(month => {
    if (prices && prices[month]) {
      // Ensure basePrice is a number
      const basePrice = Number(prices[month].basePrice) || 0;
      
      // Process ranges
      const ranges = (Array.isArray(prices[month].ranges) 
        ? prices[month].ranges.map(range => ({
            startDate: String(range.startDate),
            endDate: String(range.endDate),
            price: Number(range.price) || 0
          }))
        : [];
      
      fullPrices[month] = { basePrice, ranges };
    } else {
      fullPrices[month] = { basePrice: 0, ranges: [] };
    }
  });
  
  return fullPrices;
};

// Insert new room price data
const priceInsert = async (req, res) => {
  try {
    const { roomName, prices } = req.body;

    if (!roomName || !prices) {
      return res.status(400).json({ 
        success: false,
        error: "Missing roomName or prices" 
      });
    }

    const fullPrices = preparePriceData(prices);

    const newRoomPrice = new RoomPrice({
      roomName,
      prices: fullPrices
    });

    // Validate before saving
    await newRoomPrice.validate();

    const result = await newRoomPrice.save();
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("Insert failed:", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: "Validation failed",
        details: err.errors 
      });
    }
    
    if (err.code === 11000) {
      return res.status(409).json({ 
        success: false,
        error: "Room already exists",
        details: `Room ${req.body.roomName} already exists in the database`
      });
    }
    
    res.status(500).json({ 
      success: false,
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
      return res.status(404).json({ 
        success: false,
        error: "Room not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// View all room prices
const priceViewAll = async (req, res) => {
  try {
    const rooms = await RoomPrice.find({});
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Update room price by roomName
const priceUpdate = async (req, res) => {
  try {
    const { roomName, prices } = req.body;

    if (!roomName || !prices) {
      return res.status(400).json({ 
        success: false,
        error: "Missing roomName or prices" 
      });
    }

    const fullPrices = preparePriceData(prices);

    const updated = await RoomPrice.findOneAndUpdate(
      { roomName },
      { prices: fullPrices, updatedAt: new Date() },
      { 
        new: true,
        upsert: false, // Don't create if doesn't exist
        runValidators: true 
      }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        error: "Room not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (err) {
    console.error("Update error:", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: "Validation failed",
        details: err.errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
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
      return res.status(400).json({ 
        success: false,
        error: "Missing roomName, month, startDate, or endDate" 
      });
    }

    // Validate month
    const validMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    if (!validMonths.includes(month.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid month",
        details: "Month must be one of: jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec"
      });
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
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        error: "Room not found or update failed" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Range deleted successfully", 
      data: updated 
    });
  } catch (err) {
    console.error("Delete error:", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: "Validation failed",
        details: err.errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Failed to delete date range",
      details: err.message 
    });
  }
};

// Delete entire room price document
const priceDelete = async (req, res) => {
  try {
    const { roomName } = req.body;
    
    if (!roomName) {
      return res.status(400).json({ 
        success: false,
        error: "Missing roomName" 
      });
    }

    const result = await RoomPrice.findOneAndDelete({ roomName });
    
    if (!result) {
      return res.status(404).json({ 
        success: false,
        error: "Room not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Room price deleted successfully",
      data: result
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete room",
      details: err.message 
    });
  }
};

module.exports = { 
  priceInsert, 
  priceView, 
  priceViewAll,
  priceUpdate,
  priceRangeDelete,
  priceDelete
};