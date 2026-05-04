const express = require('express');
const router = express.Router();
const { createRegistration, getMyRegistrations, getAllRegistrations } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createRegistration)
  .get(protect, getMyRegistrations);

router.get('/all', protect, getAllRegistrations);

module.exports = router;
