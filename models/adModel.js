
const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seller:{
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
});

const Ad = mongoose.model('Ad', adSchema);
module.exports = Ad
