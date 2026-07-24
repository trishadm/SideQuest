const User = require('../models/User');
const { addXP } = require('../services/gamificationService');

// @desc Update user general info
// @route PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, location, languages, availability, onlinePreference, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (languages) user.languages = languages;
    if (availability) user.availability = availability;
    if (onlinePreference) user.onlinePreference = onlinePreference;
    if (avatar) user.avatar = avatar;

    await user.save();
    
    // Award XP for updating profile
    await addXP(user._id, 25, 'Profile updated');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// @desc Add or update teaching skill
// @route POST /api/users/skills/teach
exports.addTeachingSkill = async (req, res) => {
  try {
    const { name, category, level, yearsOfExperience, teachingMode, proofUrl, proofType } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if skill already exists
    const existingIndex = user.teachingSkills.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
    const newSkillData = {
      name,
      category: category || 'Other',
      level: level || 3,
      yearsOfExperience: yearsOfExperience || 1,
      teachingMode: teachingMode || 'Both',
      verificationStatus: proofUrl ? 'Verified' : 'Unverified',
      proofUrl: proofUrl || '',
      proofType: proofType || 'Portfolio'
    };

    if (existingIndex > -1) {
      user.teachingSkills[existingIndex] = newSkillData;
    } else {
      user.teachingSkills.push(newSkillData);
    }

    await user.save();
    await addXP(user._id, 50, 'Added skill to teach');

    res.json(user.teachingSkills);
  } catch (error) {
    res.status(500).json({ message: 'Error adding teaching skill', error: error.message });
  }
};

// @desc Remove teaching skill
// @route DELETE /api/users/skills/teach/:skillId
exports.deleteTeachingSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.teachingSkills = user.teachingSkills.filter(s => s._id.toString() !== req.params.skillId);
    await user.save();

    res.json(user.teachingSkills);
  } catch (error) {
    res.status(500).json({ message: 'Error removing teaching skill' });
  }
};

// @desc Add or update learning skill
// @route POST /api/users/skills/learn
exports.addLearningSkill = async (req, res) => {
  try {
    const { name, category, desiredLevel, goal, priority } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingIndex = user.learningSkills.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
    const newSkillData = {
      name,
      category: category || 'Other',
      desiredLevel: desiredLevel || 3,
      goal: goal || 'Hobby',
      priority: priority || 'Medium'
    };

    if (existingIndex > -1) {
      user.learningSkills[existingIndex] = newSkillData;
    } else {
      user.learningSkills.push(newSkillData);
    }

    await user.save();
    await addXP(user._id, 30, 'Added skill to learn');

    res.json(user.learningSkills);
  } catch (error) {
    res.status(500).json({ message: 'Error adding learning skill', error: error.message });
  }
};

// @desc Remove learning skill
// @route DELETE /api/users/skills/learn/:skillId
exports.deleteLearningSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.learningSkills = user.learningSkills.filter(s => s._id.toString() !== req.params.skillId);
    await user.save();

    res.json(user.learningSkills);
  } catch (error) {
    res.status(500).json({ message: 'Error removing learning skill' });
  }
};

// @desc Get Profile by Username or ID
// @route GET /api/users/:identifier
exports.getUserProfile = async (req, res) => {
  try {
    const { identifier } = req.params;
    let user;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier).select('-password');
    } else {
      user = await User.findOne({ username: identifier.toLowerCase() }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// @desc Search users by query parameters
// @route GET /api/users/search
exports.searchUsers = async (req, res) => {
  try {
    const { query, skill, category, location, language, teachingMode, minLevel } = req.query;
    let findQuery = { isBanned: false };

    if (query) {
      findQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { 'teachingSkills.name': { $regex: query, $options: 'i' } },
        { 'learningSkills.name': { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ];
    }

    if (skill) {
      findQuery['teachingSkills.name'] = { $regex: skill, $options: 'i' };
    }

    if (category) {
      findQuery['teachingSkills.category'] = category;
    }

    if (location) {
      findQuery.location = { $regex: location, $options: 'i' };
    }

    if (language) {
      findQuery.languages = { $regex: language, $options: 'i' };
    }

    if (teachingMode && teachingMode !== 'All') {
      findQuery['teachingSkills.teachingMode'] = { $in: [teachingMode, 'Both'] };
    }

    const users = await User.find(findQuery).select('-password').limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Search error', error: error.message });
  }
};
