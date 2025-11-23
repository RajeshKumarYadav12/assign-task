const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');
const keys = require('../config/keys');

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Not authorized to access this route', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, keys.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      if (!user.isActive) {
        return errorResponse(res, 'User account is deactivated', 403);
      }

      // Attach user to request
      req.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name,
      };

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
      }
      if (error.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
