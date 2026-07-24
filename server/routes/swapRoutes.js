const express = require('express');
const router = express.Router();
const { createSwapRequest, getSwapRequests, respondSwapRequest } = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSwapRequest);
router.get('/', protect, getSwapRequests);
router.put('/:id/respond', protect, respondSwapRequest);

module.exports = router;
