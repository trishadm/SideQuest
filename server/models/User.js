const mongoose = require('mongoose');

const teachingSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Programming & Tech', 'Design & Arts', 'Languages', 'Music & Audio', 'Business & Marketing', 'Academics & Science', 'Fitness & Wellness', 'Crafts & Life Skills', 'Other']
  },
  level: { type: Number, required: true, min: 1, max: 5, default: 3 }, // 1=Novice, 2=Beginner, 3=Intermediate, 4=Advanced, 5=Expert
  yearsOfExperience: { type: Number, default: 1 },
  teachingMode: { type: String, enum: ['Online', 'Offline', 'Both'], default: 'Both' },
  verificationStatus: { type: String, enum: ['Verified', 'Pending', 'Unverified'], default: 'Unverified' },
  proofUrl: { type: String, default: '' }, // GitHub, Portfolio, LinkedIn, Certificate link
  proofType: { type: String, enum: ['GitHub', 'Portfolio', 'Certificate', 'LinkedIn', 'Project', 'Other'], default: 'Portfolio' }
});

const learningSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Programming & Tech', 'Design & Arts', 'Languages', 'Music & Audio', 'Business & Marketing', 'Academics & Science', 'Fitness & Wellness', 'Crafts & Life Skills', 'Other']
  },
  desiredLevel: { type: Number, min: 1, max: 5, default: 3 },
  goal: { 
    type: String, 
    enum: ['Career', 'Interview', 'College', 'Hobby', 'Personal Interest'], 
    default: 'Hobby' 
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  location: { type: String, default: 'Remote / Anywhere' },
  languages: [{ type: String }], // e.g. ['English', 'Spanish']
  availability: [{ type: String }], // e.g. ['Weekends', 'Evenings', 'Flexible']
  onlinePreference: { type: String, enum: ['Online', 'Offline', 'Flexible'], default: 'Flexible' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBanned: { type: Boolean, default: false },
  
  // Gamification
  xp: { type: Number, default: 150 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }], // e.g. ['First Swap', 'Top Mentor', 'Quick Learner']

  // Ratings Summary
  ratings: {
    overall: { type: Number, default: 5.0 },
    teachingQuality: { type: Number, default: 5.0 },
    communication: { type: Number, default: 5.0 },
    knowledge: { type: Number, default: 5.0 },
    friendliness: { type: Number, default: 5.0 },
    punctuality: { type: Number, default: 5.0 },
    totalReviews: { type: Number, default: 0 }
  },

  completedSwapsCount: { type: Number, default: 0 },

  // Skills
  teachingSkills: [teachingSkillSchema],
  learningSkills: [learningSkillSchema],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isEmailVerified: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
