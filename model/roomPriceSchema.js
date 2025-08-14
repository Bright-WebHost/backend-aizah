const mongoose = require('mongoose');
const { Schema } = mongoose;

const dateRangeSchema = new Schema({
  startDate: { type: String, required: true },  // Format: YYYY-MM-DD
  endDate: { type: String, required: true },
  price: { type: Number, required: true }
});

const monthDataSchema = new Schema({
  basePrice: { type: Number, default: 0 },
  ranges: [dateRangeSchema]
});

const roomPriceSchema = new Schema({
  roomName: {
    type: String,
    enum: ['Merano-1710', 'Majestine-618', 'Reva-1811', 'Merano-2906'],
    required: true,
    unique: true
  },
  prices: {
    jan: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    feb: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    mar: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    apr: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    may: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    jun: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    jul: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    aug: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    sep: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    oct: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    nov: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) },
    dec: { type: monthDataSchema, default: () => ({ basePrice: 0, ranges: [] }) }
  },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure all months exist before saving
roomPriceSchema.pre('save', function (next) {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  months.forEach(month => {
    if (!this.prices[month]) {
      this.prices[month] = { basePrice: 0, ranges: [] };
    }
  });
  next();
});

module.exports = mongoose.model('RoomPrice', roomPriceSchema);
