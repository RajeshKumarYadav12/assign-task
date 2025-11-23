const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

/**
 * Generate JWT access token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
exports.generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, keys.JWT_SECRET, {
    expiresIn: keys.JWT_EXPIRE,
  });
};

/**
 * Generate JWT refresh token
 * @param {string} id - User ID
 * @returns {string} JWT refresh token
 */
exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, keys.JWT_REFRESH_SECRET, {
    expiresIn: keys.JWT_REFRESH_EXPIRE,
  });
};
