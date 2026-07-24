const express = require('express');
const router = express.Router();
const { 
  updateProfile, 
  addTeachingSkill, 
  deleteTeachingSkill, 
  addLearningSkill, 
  deleteLearningSkill, 
  getUserProfile, 
  searchUsers 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', searchUsers);
router.put('/profile', protect, updateProfile);
router.post('/skills/teach', protect, addTeachingSkill);
router.delete('/skills/teach/:skillId', protect, deleteTeachingSkill);
router.post('/skills/learn', protect, addLearningSkill);
router.delete('/skills/learn/:skillId', protect, deleteLearningSkill);
router.get('/:identifier', getUserProfile);

module.exports = router;
