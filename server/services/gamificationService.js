/**
 * Gamification Service for SideQuest
 * Handles XP awards, level calculations, and automatic badge unlocks.
 */

const User = require('../models/User');

const BADGE_DEFINITIONS = [
  { id: 'First Swap', name: 'First Swap', description: 'Completed your first skill swap session', icon: 'Sparkles', xpBonus: 100 },
  { id: '10 Successful Swaps', name: '10 Swaps Veteran', description: 'Successfully completed 10 skill exchange swaps', icon: 'Trophy', xpBonus: 500 },
  { id: 'Top Mentor', name: 'Top Mentor', description: 'Maintained a 4.8+ rating across 5+ teaching reviews', icon: 'Award', xpBonus: 300 },
  { id: 'Quick Learner', name: 'Quick Learner', description: 'Completed 3 learning sessions in record time', icon: 'Zap', xpBonus: 150 },
  { id: 'Community Helper', name: 'Community Helper', description: 'Reached 500+ total XP on SideQuest', icon: 'Heart', xpBonus: 200 }
];

async function addXP(userId, xpAmount, actionReason = '') {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.xp += xpAmount;
    // Calculate level: Level 1 starts at 0, level up every 250 XP
    const newLevel = Math.floor(user.xp / 250) + 1;
    let leveledUp = false;
    if (newLevel > user.level) {
      user.level = newLevel;
      leveledUp = true;
    }

    // Check for badge unlocks
    const unlockedBadges = user.badges || [];
    const newBadgesUnlocked = [];

    // Badge Check: First Swap
    if (user.completedSwapsCount >= 1 && !unlockedBadges.includes('First Swap')) {
      user.badges.push('First Swap');
      newBadgesUnlocked.push('First Swap');
    }

    // Badge Check: 10 Swaps Veteran
    if (user.completedSwapsCount >= 10 && !unlockedBadges.includes('10 Successful Swaps')) {
      user.badges.push('10 Successful Swaps');
      newBadgesUnlocked.push('10 Successful Swaps');
    }

    // Badge Check: Top Mentor
    if (user.ratings && user.ratings.overall >= 4.8 && user.ratings.totalReviews >= 5 && !unlockedBadges.includes('Top Mentor')) {
      user.badges.push('Top Mentor');
      newBadgesUnlocked.push('Top Mentor');
    }

    // Badge Check: Community Helper
    if (user.xp >= 500 && !unlockedBadges.includes('Community Helper')) {
      user.badges.push('Community Helper');
      newBadgesUnlocked.push('Community Helper');
    }

    await user.save();

    return {
      user,
      xpGained: xpAmount,
      currentXP: user.xp,
      level: user.level,
      leveledUp,
      newBadgesUnlocked
    };
  } catch (error) {
    console.error('Error adding XP:', error);
    return null;
  }
}

module.exports = {
  addXP,
  BADGE_DEFINITIONS
};
