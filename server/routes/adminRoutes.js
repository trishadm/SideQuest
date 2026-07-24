const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminUsers, toggleBanUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/users', protect, adminOnly, getAdminUsers);
router.put('/users/:userId/ban', protect, adminOnly, toggleBanUser);

module.exports = router;
