const mongoose = require('mongoose');
const { Schema } = mongoose;

const dateRangeSchema = new Schema({
  startDate: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format (YYYY-MM-DD)!`
    }
  },
  endDate: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format (YYYY-MM-DD)!`
    }
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price must be positive']
  }
});

const monthDataSchema = new Schema({
  basePrice: { 
    type: Number, 
    default: 0,
    min: [0, 'Base price must be positive']
  },
  ranges: {
    type: [dateRangeSchema],
    validate: {
      validator: function(ranges) {
        // Check for overlapping date ranges
        for (let i = 0; i < ranges.length; i++) {
          for (let j = i + 1; j < ranges.length; j++) {
            const aStart = new Date(ranges[i].startDate);
            const aEnd = new Date(ranges[i].endDate);
            const bStart = new Date(ranges[j].startDate);
            const bEnd = new Date(ranges[j].endDate);
            
            if (aStart <= bEnd && bStart <= aEnd) {
              return false;
            }
          }
        }
        return true;
      },
      message: 'Date ranges must not overlap within the same month'
    }
  }
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
}, {
  // Enable optimistic concurrency control
  optimisticConcurrency: true
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

// Index for faster queries
roomPriceSchema.index({ roomName: 1 }, { unique: true });

module.exports = mongoose.model('RoomPrice', roomPriceSchema);