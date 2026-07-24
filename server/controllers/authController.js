const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'sidequest_super_secret_jwt_token_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc Register User
// @route POST /api/auth/signup
exports.signup = async (req, res) => {
  console.log('\n--- 📥 [SIGNUP REQUEST RECEIVED] ---');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Payload:', { ...req.body, password: '[REDACTED]' });

  try {
    const { name, username, email, password, location, bio } = req.body;

    // Step 1: Field Validation
    if (!name || !username || !email || !password) {
      console.warn('⚠️ [SIGNUP REJECTED 400]: Missing required fields');
      return res.status(400).json({ 
        message: 'Please provide all required fields: Full Name, Username, Email, and Password.',
        details: { name: !!name, username: !!username, email: !!email, password: !!password }
      });
    }

    if (password.length < 6) {
      console.warn('⚠️ [SIGNUP REJECTED 400]: Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Step 2: Check Database Connection State
    const dbState = mongoose.connection.readyState; // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    console.log(`📊 Current Mongoose DB ReadyState: ${dbState} (${['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][dbState] || 'Unknown'})`);

    if (dbState !== 1) {
      console.error('❌ [SIGNUP FAILED 503]: Database is not connected');
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please check server logs for MongoDB connection status.',
        dbState
      });
    }

    // Step 3: Check duplicate email or username
    console.log(`🔍 Checking if user exists with email: ${email.toLowerCase()} or username: ${username.toLowerCase()}`);
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase().trim() }, 
        { username: username.toLowerCase().trim() }
      ] 
    });

    if (existingUser) {
      const isEmailMatch = existingUser.email === email.toLowerCase().trim();
      const conflictField = isEmailMatch ? 'Email address' : 'Username';
      console.warn(`⚠️ [SIGNUP CONFLICT 409]: ${conflictField} already taken (${existingUser.email} / ${existingUser.username})`);
      return res.status(409).json({ 
        message: `${conflictField} is already registered. Please log in or choose another.` 
      });
    }

    // Step 4: Hash password
    console.log('🔑 Hashing password with bcrypt...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 5: Save User to DB
    console.log('💾 Saving new user document to MongoDB...');
    const newUser = await User.create({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      location: location ? location.trim() : 'Remote / Online',
      bio: bio ? bio.trim() : 'Excited to swap skills on SideQuest!',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      teachingSkills: [],
      learningSkills: [],
      availability: ['Weekends', 'Evenings'],
      languages: ['English']
    });

    console.log(`✅ [USER CREATED]: ID ${newUser._id}, Username: ${newUser.username}, Email: ${newUser.email}`);

    // Step 6: Generate JWT Token
    const token = generateToken(newUser);
    console.log('🎫 JWT Token generated successfully.');

    const userObj = newUser.toObject();
    delete userObj.password;

    console.log('✨ Registration flow completed successfully. Returning 201 Created.\n');
    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: userObj
    });

  } catch (error) {
    console.error('💥 [SIGNUP ERROR TRACE]:', error);

    // Duplicate key error (MongoDB code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({ 
        message: `Account creation failed: An account with this ${field} already exists.`,
        error: error.message 
      });
    }

    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
      const validationMsgs = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ 
        message: `Validation failed: ${validationMsgs}`,
        error: error.message 
      });
    }

    return res.status(500).json({ 
      message: `Registration failed due to server error: ${error.message}`, 
      error: error.message 
    });
  }
};

// @desc Login User
// @route POST /api/auth/login
exports.login = async (req, res) => {
  console.log('\n--- 📥 [LOGIN REQUEST RECEIVED] ---');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Payload:', { ...req.body, password: '[REDACTED]' });

  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      console.warn('⚠️ [LOGIN REJECTED 400]: Missing emailOrUsername or password');
      return res.status(400).json({ message: 'Please provide both username/email and password.' });
    }

    const dbState = mongoose.connection.readyState;
    console.log(`📊 Current Mongoose DB ReadyState: ${dbState} (${['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][dbState] || 'Unknown'})`);

    if (dbState !== 1) {
      console.error('❌ [LOGIN FAILED 503]: Database is not connected');
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please check server status.',
        dbState
      });
    }

    const query = emailOrUsername.includes('@') 
      ? { email: emailOrUsername.toLowerCase().trim() } 
      : { username: emailOrUsername.toLowerCase().trim() };

    console.log('🔍 Looking up user in DB with query:', query);
    const user = await User.findOne(query);

    if (!user) {
      console.warn(`⚠️ [LOGIN FAILED 401]: User not found for query ${JSON.stringify(query)}`);
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    if (user.isBanned) {
      console.warn(`⚠️ [LOGIN FAILED 403]: User ${user.username} is suspended`);
      return res.status(403).json({ message: 'Account has been suspended' });
    }

    console.log(`🔑 Verifying password for user ${user.username}...`);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.warn(`⚠️ [LOGIN FAILED 401]: Incorrect password for user ${user.username}`);
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    user.isOnline = true;
    await user.save();

    const token = generateToken(user);
    console.log(`✅ [LOGIN SUCCESSFUL]: User ${user.username} logged in.`);

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({
      token,
      user: userObj
    });
  } catch (error) {
    console.error('💥 [LOGIN ERROR TRACE]:', error);
    return res.status(500).json({ message: `Server error during login: ${error.message}`, error: error.message });
  }
};

// @desc Get Me
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// @desc Forgot Password
// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No account with that email address exists' });
    }

    res.json({ message: 'Password reset link simulated! In production, check your email inbox.', resetToken: 'demo-reset-token-123' });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting password reset' });
  }
};

// @desc Reset Password
// @route POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password reset successfully. You may now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};
