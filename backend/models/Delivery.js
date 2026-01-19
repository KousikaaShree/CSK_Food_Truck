const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  vehicleNumber: {
    type: String,
    trim: true
  },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  available: {
    type: Boolean,
    default: true
  },
  activeOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema);

