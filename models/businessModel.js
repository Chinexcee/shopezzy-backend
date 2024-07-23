

const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  businessname: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  address: {
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
});

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
