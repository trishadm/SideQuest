const User = require('../models/User');
const { calculateCompatibility } = require('../services/matchingEngine');
const { findIndirectExchangeChains } = require('../services/graphMatchingService');

// @desc Get recommended matches ranked by weighted compatibility score
// @route GET /api/matches
exports.getRecommendedMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const { category, location, language, minRating, teachingMode, minScore } = req.query;

    let query = { _id: { $ne: currentUser._id }, isBanned: false };

    if (location) query.location = { $regex: location, $options: 'i' };
    if (language) query.languages = { $regex: language, $options: 'i' };
    if (minRating) query['ratings.overall'] = { $gte: parseFloat(minRating) };

    const candidates = await User.find(query).select('-password');

    let matches = candidates.map(candidate => {
      const { compatibilityScore, breakdown, rationales } = calculateCompatibility(currentUser, candidate);
      return {
        user: candidate,
        compatibilityScore,
        breakdown,
        rationales
      };
    });

    // Filtering by skill category or teaching mode if specified
    if (category && category !== 'All') {
      matches = matches.filter(m => 
        (m.user.teachingSkills || []).some(s => s.category === category) ||
        (m.user.learningSkills || []).some(s => s.category === category)
      );
    }

    if (teachingMode && teachingMode !== 'All') {
      matches = matches.filter(m => 
        (m.user.teachingSkills || []).some(s => s.teachingMode === teachingMode || s.teachingMode === 'Both')
      );
    }

    if (minScore) {
      matches = matches.filter(m => m.compatibilityScore >= parseInt(minScore));
    }

    // Sort by compatibility percentage descending
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(matches);
  } catch (error) {
    console.error('Match Calculation Error:', error);
    res.status(500).json({ message: 'Error generating skill matches', error: error.message });
  }
};

// @desc Get indirect multi-user skill exchange graph chains (A -> B -> C -> A)
// @route GET /api/matches/chains
exports.getIndirectChains = async (req, res) => {
  try {
    const users = await User.find({ isBanned: false }).select('-password');
    const chains = findIndirectExchangeChains(users, 3);
    res.json(chains);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating indirect exchange chains', error: error.message });
  }
};
