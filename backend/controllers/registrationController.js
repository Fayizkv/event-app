const Registration = require('../models/Registration');
const Event = require('../models/Event');

const createRegistration = async (req, res) => {
  try {
    const { eventId, category, weightCategory, participants, teamLeaderName, mobileNumber } = req.body;
    const mandalamId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Validate limit
    const existingCount = await Registration.countDocuments({
      mandalam: mandalamId,
      event: eventId,
      category: category,
      ...(weightCategory && { weightCategory })
    });

    if (existingCount >= event.maxPerMandalam) {
      return res.status(400).json({ message: `Registration limit reached for this event category.` });
    }

    const registration = new Registration({
      mandalam: mandalamId,
      event: eventId,
      category,
      weightCategory,
      participants,
      teamLeaderName,
      mobileNumber
    });

    const createdRegistration = await registration.save();
    
    // Populate event to return full detail
    const populated = await Registration.findById(createdRegistration._id).populate('event');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating registration' });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    // console.log('reg route');
    const registrations = await Registration.find({ mandalam: req.user._id }).populate('event');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching registrations' });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an admin' });
    }
    const registrations = await Registration.find({}).populate('event').populate('mandalam');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching all registrations' });
  }
};

module.exports = { createRegistration, getMyRegistrations, getAllRegistrations };
