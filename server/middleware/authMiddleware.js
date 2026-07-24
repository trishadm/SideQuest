const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sidequest_super_secret_jwt_token_key_2026');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      // Fallback for mock users when DB is empty
      req.user = { _id: decoded.id, id: decoded.id, name: decoded.name || 'User', email: decoded.email || 'user@example.com', role: decoded.role || 'user' };
      return next();
    }
    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Token Verification Error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = { protect };
