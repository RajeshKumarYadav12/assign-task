const { errorResponse } = require('../utils/response');

/**
 * Authorize specific roles
 * @param  {...string} roles - Roles that are allowed
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Not authorized to access this route', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }

    next();
  };
};
