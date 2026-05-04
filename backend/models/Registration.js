const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  mandalam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mandalam',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  weightCategory: {
    type: String,
  },
  participants: [{
    name: {
      type: String,
      required: true,
    }
  }],
  teamLeaderName: {
    type: String,
  },
  mobileNumber: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
