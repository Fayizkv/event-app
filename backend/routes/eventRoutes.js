const express = require('express');
const router = express.Router();
const { getEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEvents);

module.exports = router;
