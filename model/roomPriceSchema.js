  const mongoose =require('mongoose');
const {Schema} =mongoose;
const roomPriceSchema= new Schema({
  roomName: {
    type: String,
    enum: ['Merano-1710', 'Majestine-618', 'Reva-1811','Merano-2906','Chic-1','Dubail-mall','Chic-studio'], // ✅ Match frontend
    required: true
  },
  prices: {
    jan: { type: Number, required: true },
    feb: { type: Number, required: true },
    mar: { type: Number, required: true },
    apr: { type: Number, required: true },
    may: { type: Number, required: true },
    jun: { type: Number, required: true },
    jul: { type: Number, required: true },
    aug: { type: Number, required: true },
    sep: { type: Number, required: true },
    oct: { type: Number, required: true },
    nov: { type: Number, required: true },
    dec: { type: Number, required: true },
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RoomPrice',roomPriceSchema);




