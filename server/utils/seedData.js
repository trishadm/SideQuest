const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');
const SessionPlan = require('../models/Session');
const Message = require('../models/Message');

const seedData = async (options = { exitProcess: true }) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0 && !options.force) {
      console.log(`🌱 Database already contains ${userCount} users. Skipping auto-seed.`);
      return;
    }

    await User.deleteMany({});
    await SwapRequest.deleteMany({});
    await SessionPlan.deleteMany({});
    await Message.deleteMany({});

    console.log('Cleared existing data.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const usersData = [
      {
        name: 'Trisha Sharma',
        username: 'trisha_dev',
        email: 'trisha@sidequest.com',
        password: hashedPassword,
        bio: 'Full-stack developer passionate about building modern web apps. Looking to learn Acoustic Guitar & Conversational Spanish!',
        location: 'Bengaluru, India',
        languages: ['English', 'Hindi'],
        availability: ['Weekends', 'Evenings'],
        onlinePreference: 'Flexible',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        xp: 450,
        level: 2,
        badges: ['First Swap', 'Community Helper'],
        ratings: { overall: 4.9, teachingQuality: 5.0, communication: 4.9, knowledge: 5.0, friendliness: 4.8, punctuality: 4.9, totalReviews: 8 },
        completedSwapsCount: 3,
        role: 'user',
        teachingSkills: [
          { name: 'Python & Django', category: 'Programming & Tech', level: 4, yearsOfExperience: 3, teachingMode: 'Both', verificationStatus: 'Verified', proofUrl: 'https://github.com', proofType: 'GitHub' },
          { name: 'React & Tailwind', category: 'Programming & Tech', level: 4, yearsOfExperience: 2, teachingMode: 'Online', verificationStatus: 'Verified', proofUrl: 'https://github.com', proofType: 'Portfolio' }
        ],
        learningSkills: [
          { name: 'Acoustic Guitar', category: 'Music & Audio', desiredLevel: 3, goal: 'Hobby', priority: 'High' },
          { name: 'Spanish Conversation', category: 'Languages', desiredLevel: 2, goal: 'Personal Interest', priority: 'Medium' }
        ]
      },
      {
        name: 'Alex Rivera',
        username: 'alex_code',
        email: 'alex@sidequest.com',
        password: hashedPassword,
        bio: 'Senior Backend Engineer. Love teaching Python, Docker & System Architecture in exchange for music theory or guitar!',
        location: 'Bengaluru, India',
        languages: ['English', 'Spanish'],
        availability: ['Weekends', 'Evenings'],
        onlinePreference: 'Online',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
        xp: 850,
        level: 4,
        badges: ['First Swap', 'Top Mentor', 'Quick Learner', 'Community Helper'],
        ratings: { overall: 5.0, teachingQuality: 5.0, communication: 5.0, knowledge: 5.0, friendliness: 4.9, punctuality: 5.0, totalReviews: 12 },
        completedSwapsCount: 7,
        role: 'user',
        teachingSkills: [
          { name: 'Python & Data Structures', category: 'Programming & Tech', level: 5, yearsOfExperience: 6, teachingMode: 'Both', verificationStatus: 'Verified', proofUrl: 'https://github.com/alexrivera', proofType: 'GitHub' },
          { name: 'Docker & Kubernetes', category: 'Programming & Tech', level: 4, yearsOfExperience: 4, teachingMode: 'Online', verificationStatus: 'Verified', proofUrl: 'https://linkedin.com/in/alex', proofType: 'LinkedIn' }
        ],
        learningSkills: [
          { name: 'Acoustic Guitar', category: 'Music & Audio', desiredLevel: 3, goal: 'Hobby', priority: 'High' },
          { name: 'UI/UX Design', category: 'Design & Arts', desiredLevel: 2, goal: 'Career', priority: 'Medium' }
        ]
      },
      {
        name: 'Elena Rostova',
        username: 'elena_music',
        email: 'elena@sidequest.com',
        password: hashedPassword,
        bio: 'Professional musician & guitar tutor with 8 years of acoustic & electric guitar experience. Eager to master Python for music software automation!',
        location: 'Bengaluru, India',
        languages: ['English', 'Russian'],
        availability: ['Weekends', 'Evenings'],
        onlinePreference: 'Flexible',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        xp: 620,
        level: 3,
        badges: ['First Swap', 'Top Mentor'],
        ratings: { overall: 4.9, teachingQuality: 5.0, communication: 4.8, knowledge: 5.0, friendliness: 5.0, punctuality: 4.8, totalReviews: 9 },
        completedSwapsCount: 5,
        role: 'user',
        teachingSkills: [
          { name: 'Acoustic Guitar', category: 'Music & Audio', level: 5, yearsOfExperience: 8, teachingMode: 'Both', verificationStatus: 'Verified', proofUrl: 'https://youtube.com', proofType: 'Portfolio' },
          { name: 'Piano & Music Theory', category: 'Music & Audio', level: 4, yearsOfExperience: 5, teachingMode: 'Online', verificationStatus: 'Verified', proofUrl: 'https://soundcloud.com', proofType: 'Portfolio' }
        ],
        learningSkills: [
          { name: 'Python & Data Structures', category: 'Programming & Tech', desiredLevel: 3, goal: 'Career', priority: 'High' },
          { name: 'Digital Marketing', category: 'Business & Marketing', desiredLevel: 2, goal: 'Hobby', priority: 'Low' }
        ]
      },
      {
        name: 'Marcus Vance',
        username: 'marcus_ux',
        email: 'marcus@sidequest.com',
        password: hashedPassword,
        bio: 'Lead Product Designer at a tech startup. Specializing in Figma, Design Systems, and Design Thinking. Looking for Spanish language practice!',
        location: 'Remote / Anywhere',
        languages: ['English'],
        availability: ['Weekends', 'Flexible'],
        onlinePreference: 'Online',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        xp: 380,
        level: 2,
        badges: ['First Swap'],
        ratings: { overall: 4.8, teachingQuality: 4.9, communication: 4.7, knowledge: 5.0, friendliness: 4.8, punctuality: 4.7, totalReviews: 6 },
        completedSwapsCount: 2,
        role: 'user',
        teachingSkills: [
          { name: 'UI/UX Design & Figma', category: 'Design & Arts', level: 5, yearsOfExperience: 5, teachingMode: 'Online', verificationStatus: 'Verified', proofUrl: 'https://behance.net', proofType: 'Portfolio' }
        ],
        learningSkills: [
          { name: 'Spanish Conversation', category: 'Languages', desiredLevel: 3, goal: 'Personal Interest', priority: 'High' }
        ]
      },
      {
        name: 'Sophia Chen',
        username: 'sophia_lang',
        email: 'sophia@sidequest.com',
        password: hashedPassword,
        bio: 'Native Spanish and Mandarin speaker. Certified language instructor. Wanting to learn UI/UX design to build my own language learning platform!',
        location: 'Remote / Anywhere',
        languages: ['English', 'Spanish', 'Mandarin'],
        availability: ['Weekends', 'Evenings'],
        onlinePreference: 'Online',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        xp: 920,
        level: 4,
        badges: ['First Swap', '10 Successful Swaps', 'Top Mentor', 'Community Helper'],
        ratings: { overall: 5.0, teachingQuality: 5.0, communication: 5.0, knowledge: 5.0, friendliness: 5.0, punctuality: 5.0, totalReviews: 15 },
        completedSwapsCount: 10,
        role: 'user',
        teachingSkills: [
          { name: 'Spanish Conversation', category: 'Languages', level: 5, yearsOfExperience: 7, teachingMode: 'Online', verificationStatus: 'Verified', proofUrl: 'https://linkedin.com', proofType: 'LinkedIn' }
        ],
        learningSkills: [
          { name: 'UI/UX Design & Figma', category: 'Design & Arts', desiredLevel: 3, goal: 'Career', priority: 'High' }
        ]
      },
      {
        name: 'Admin Moderator',
        username: 'admin',
        email: 'admin@sidequest.com',
        password: hashedPassword,
        bio: 'SideQuest System Administrator & Community Moderator.',
        location: 'San Francisco, CA',
        languages: ['English'],
        availability: ['Flexible'],
        onlinePreference: 'Online',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        xp: 2500,
        level: 10,
        badges: ['Top Mentor', 'Community Helper'],
        ratings: { overall: 5.0, teachingQuality: 5.0, communication: 5.0, knowledge: 5.0, friendliness: 5.0, punctuality: 5.0, totalReviews: 20 },
        completedSwapsCount: 25,
        role: 'admin',
        teachingSkills: [],
        learningSkills: []
      }
    ];

    const createdUsers = await User.insertMany(usersData);
    console.log(`🌱 Seeded ${createdUsers.length} initial users.`);

    const trisha = createdUsers.find(u => u.username === 'trisha_dev');
    const elena = createdUsers.find(u => u.username === 'elena_music');

    if (trisha && elena) {
      const sampleSwap = await SwapRequest.create({
        sender: trisha._id,
        receiver: elena._id,
        offeredSkill: 'Python & Django',
        requestedSkill: 'Acoustic Guitar',
        message: 'Hey Elena! I saw you want to learn Python for music software. I would love to teach you Python in exchange for Acoustic Guitar fundamentals!',
        availability: 'Weekends & Evenings',
        preferredDuration: '4 sessions (1 month)',
        status: 'Accepted',
        compatibilityScore: 96
      });

      await SessionPlan.create({
        swapRequest: sampleSwap._id,
        userA: trisha._id,
        userB: elena._id,
        skillA: 'Python & Django',
        skillB: 'Acoustic Guitar',
        totalSessions: 4,
        completedSessionsCount: 2,
        sessions: [
          { sessionNumber: 1, title: 'Intro to Python syntax & Chords G, C, D', isCompleted: true, completedDate: new Date(), notes: 'Covered variables & basic open chord transitions.' },
          { sessionNumber: 2, title: 'Python Control Flow & Fingerpicking Patterns', isCompleted: true, completedDate: new Date(), notes: 'Practiced strumming rhythm and list comprehensions.' },
          { sessionNumber: 3, title: 'Functions, Modules & Song Practice (Riptide)', isCompleted: false },
          { sessionNumber: 4, title: 'Final Project Demo & Acoustic Duet Showcase', isCompleted: false }
        ],
        sharedNotes: 'Practice switching between C and G major for 10 mins daily. Alex recommends reading Python docs on modules.'
      });

      await Message.create([
        { sender: trisha._id, receiver: elena._id, content: 'Hey Elena! So excited for our Python & Guitar swap!' },
        { sender: elena._id, receiver: trisha._id, content: 'Me too Trisha! Do you have any prior guitar experience?' },
        { sender: trisha._id, receiver: elena._id, content: 'A little bit of ukulele, but brand new to steel-string acoustic!' },
        { sender: elena._id, receiver: trisha._id, content: 'Awesome! Ukulele fingerings translate really well. Let’s do our 1st session this Saturday at 4 PM!' }
      ]);
    }

    console.log('✨ Successfully seeded database!');
    if (options.exitProcess) process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    if (options.exitProcess) process.exit(1);
  }
};

if (require.main === module) {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sidequest';
  mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
    .then(() => seedData({ exitProcess: true, force: true }))
    .catch(err => {
      console.error('Failed to connect for manual seed:', err.message);
      process.exit(1);
    });
}

module.exports = seedData;

