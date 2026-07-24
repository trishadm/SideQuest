const express = require('express');
const router = express.Router();
const { getRecommendedMatches, getIndirectChains } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecommendedMatches);
router.get('/chains', protect, getIndirectChains);

module.exports = router;
