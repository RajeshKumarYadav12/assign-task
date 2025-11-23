const Joi = require('joi');
const { errorResponse } = require('../utils/response');

/**
 * Validate user registration
 */
exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
    }),
    email: Joi.string().trim().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
    password: Joi.string().min(6).max(100).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
    }),
    role: Joi.string().valid('user', 'admin').optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return errorResponse(res, 'Validation error', 400, errors);
  }

  next();
};

/**
 * Validate user login
 */
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return errorResponse(res, 'Validation error', 400, errors);
  }

  next();
};

/**
 * Validate update profile
 */
exports.validateUpdateProfile = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).optional().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
    }),
    email: Joi.string().trim().email().optional().messages({
      'string.email': 'Please provide a valid email',
    }),
  }).min(1);

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return errorResponse(res, 'Validation error', 400, errors);
  }

  next();
};

/**
 * Validate change password
 */
exports.validateChangePassword = (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().messages({
      'string.empty': 'Current password is required',
    }),
    newPassword: Joi.string().min(6).max(100).required().messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters long',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return errorResponse(res, 'Validation error', 400, errors);
  }

  next();
};
