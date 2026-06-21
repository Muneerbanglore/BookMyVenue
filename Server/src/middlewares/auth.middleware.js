const { UnauthorizedError, ForbiddenError, NotFoundError } = require('../utils/errors');
const cryptoUtils = require('../utils/crypto');
const User = require('../schemas/user.schema');
const Member = require('../schemas/member.schema');
const VenueOwner = require('../schemas/venue_owner.schema');
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
    let decoded;

    // Support hardcoded development tokens for ease of testing in development mode
    if (process.env.NODE_ENV === 'development' && (token === 'development-token' || token === 'dev-token-owner' || token === 'dev-token-user' || token.startsWith('dev-member-'))) {
      if (token.startsWith('dev-member-')) {
        decoded = { id: token.replace('dev-member-', '') };
      } else {
        const db = require('../config/firebase');
        if (!db) {
          throw new Error('Firestore not initialized for dev token resolution.');
        }
        let query = db.collection('members');
        if (token === 'dev-token-owner') {
          query = query.where('member_id', 'in', [1, 3]);
        } else if (token === 'dev-token-user') {
          query = query.where('member_id', '==', 2);
        }
        const snapshot = await query.limit(1).get();
        if (!snapshot.empty) {
          decoded = { id: snapshot.docs[0].id };
        } else {
          // Fallback to any member
          const fallbackSnapshot = await db.collection('members').limit(1).get();
          if (!fallbackSnapshot.empty) {
            decoded = { id: fallbackSnapshot.docs[0].id };
          } else {
            decoded = { id: 'dev-mock-member-id' };
          }
        }
      }
    } else {
      // Verify token signature normally
      decoded = cryptoUtils.verifyToken(token);
    }

    // Look up the core member credentials document
    const member = await Member.findById(decoded.id);
    if (!member) {
      return next(
        new NotFoundError('The user associated with this token does not exist', ErrorCodes.USER_NOT_FOUND)
      );
    }

    let profile = null;

    // member_id === 1 or 3 is VENUE_OWNER, member_id === 2 is USER
    if (member.member_id === 1 || member.member_id === 3) {
      profile = await VenueOwner.findById(decoded.id);
      if (!profile) {
        // Initialize skeleton VenueOwner profile (not saved in DB yet)
        profile = new VenueOwner({
          _id: decoded.id,
          venue_name: member.identifier,
          role_id: 3
        });
      }
      profile.role = 'VENUE_OWNER'; // Add role flag for authorize middleware check
    } else {
      profile = await User.findById(decoded.id);
      if (!profile) {
        // Initialize skeleton User profile (not saved in DB yet)
        profile = new User({
          _id: decoded.id,
          name: member.identifier,
          role: 'user',
          role_id: 2
        });
      }
      profile.role = 'USER'; // Normalize user role flag
    }

    // Attach profile object (with credentials email and phone attached)
    req.user = profile;
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
