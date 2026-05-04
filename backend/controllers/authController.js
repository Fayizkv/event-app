const jwt = require('jsonwebtoken');
const Mandalam = require('../models/Mandalam');
const Registration = require('../models/Registration');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const authUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Mandalam.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const registrations = await Registration.find({ mandalam: user._id }).populate('event');
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        district: user.district,
        token: generateToken(user._id),
        role: user.role,
        registrations: registrations
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
  const user = await Mandalam.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      district: user.district,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { authUser, getUserProfile };
