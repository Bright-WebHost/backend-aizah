const mongoose = require('mongoose');
const { Schema } = mongoose;

const dateRangeSchema = new Schema({
  startDate: { type: String, required: true }, // Format: YYYY-MM-DD
  endDate: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const monthDataSchema = new Schema({
  basePrice: { type: Number, default: 0 },
  ranges: { type: [dateRangeSchema], default: [] }
}, { _id: false });

const roomPriceSchema = new Schema({
  roomName: {
    type: String,
    enum: ['Merano-1710', 'Majestine-618', 'Reva-1811', 'Merano-2906'],
    required: true
  },
  prices: {
    type: Map,
    of: monthDataSchema,
    default: () => new Map()
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RoomPrice', roomPriceSchema);
