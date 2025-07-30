const mongoose = require('mongoose');

const rangeSchema = new mongoose.Schema({
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  price: { type: Number, required: true },
});

const monthPriceSchema = new mongoose.Schema({
  basePrice: { type: Number, required: true },
  ranges: { type: [rangeSchema], default: [] },
});

const pricesSchema = new mongoose.Schema({
  jan: { type: monthPriceSchema, required: true },
  feb: { type: monthPriceSchema, required: true },
  mar: { type: monthPriceSchema, required: true },
  apr: { type: monthPriceSchema, required: true },
  may: { type: monthPriceSchema, required: true },
  jun: { type: monthPriceSchema, required: true },
  jul: { type: monthPriceSchema, required: true },
  aug: { type: monthPriceSchema, required: true },
  sep: { type: monthPriceSchema, required: true },
  oct: { type: monthPriceSchema, required: true },
  nov: { type: monthPriceSchema, required: true },
  dec: { type: monthPriceSchema, required: true },
});

const RoomPriceSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  prices: { type: pricesSchema, required: true },
});

const RoomPrice = mongoose.model('RoomPrice', RoomPriceSchema);
module.exports = RoomPrice;
