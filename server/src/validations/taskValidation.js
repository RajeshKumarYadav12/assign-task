const Joi = require('joi');
const { errorResponse } = require('../utils/response');

/**
 * Validate task creation
 */
exports.validateCreateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(1).max(100).required().messages({
      'string.empty': 'Task title is required',
      'string.max': 'Title cannot exceed 100 characters',
    }),
    description: Joi.string().trim().max(500).optional().allow('').messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    dueDate: Joi.date().iso().optional().allow(null),
    tags: Joi.array().items(Joi.string().trim()).optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return errorResponse(res, 'Validation error', 400, errors);
  }

  next();
};

/**
 * Validate task update
 */
exports.validateUpdateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(1).max(100).optional().messages({
      'string.max': 'Title cannot exceed 100 characters',
    }),
    description: Joi.string().trim().max(500).optional().allow('').messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    dueDate: Joi.date().iso().optional().allow(null),
    tags: Joi.array().items(Joi.string().trim()).optional(),
  }).min(1);

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return errorResponse(res, 'Validation error', 400, errors);
  }

  next();
};
