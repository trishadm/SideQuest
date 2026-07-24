const express = require('express');
const router = express.Router();
const { getSessionPlans, toggleSessionItem, updateSessionNotes } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSessionPlans);
router.put('/:planId/toggle-session', protect, toggleSessionItem);
router.put('/:planId/notes', protect, updateSessionNotes);

module.exports = router;
