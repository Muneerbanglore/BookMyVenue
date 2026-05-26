const { UnauthorizedError, ForbiddenError, NotFoundError } = require('../utils/errors');
const cryptoUtils = require('../utils/crypto');
const User = require('../models/user.model');
const ErrorCodes = require('../constants/errorCodes');

/**
 * Protect routes by verifying the Bearer JWT token in Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new UnauthorizedError('No authentication token provided', ErrorCodes.AUTH_MISSING_TOKEN)
    );
  }

  try {
    // Verify token
    const decoded = cryptoUtils.verifyToken(token);

    // Hydrate user and attach to request object
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new NotFoundError('The user associated with this token does not exist', ErrorCodes.USER_NOT_FOUND)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error); // Handled by standard error handler middleware
  }
};

/**
 * Authorize specific roles for route access
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'user')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new UnauthorizedError('Session validation required', ErrorCodes.AUTH_UNAUTHORIZED)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `User role '${req.user.role}' is not authorized to perform this action`,
          ErrorCodes.AUTH_FORBIDDEN
        )
      );
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
