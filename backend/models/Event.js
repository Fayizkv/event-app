const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Individual', 'Team'],
    required: true,
  },
  category: [{
    type: String,
  }], // e.g. ['Boys', 'Girls'] or ['Boys Only']
  weightCategory: [{
    type: String,
  }], // Optional, e.g. ['Below 60', '60-80', 'Above 80']
  maxPerMandalam: {
    type: Number,
    required: true,
  }, // How many instances a single mandalam can register per category. E.g. 2 for 100m, 1 for Football.
  participantsPerTeam: {
    type: Number,
  }, // If team event, how many members. E.g. 7 for Tug of war
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
