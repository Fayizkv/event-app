const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching events' });
  }
};

module.exports = { getEvents };
