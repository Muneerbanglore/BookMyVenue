const Member = require('../schemas/member.schema');
const User = require('../schemas/user.schema');
const VenueOwner = require('../schemas/venue_owner.schema');
const { BadRequestError } = require('../utils/errors');
const cryptoUtils = require('../utils/crypto');

const createOnboardingAccount = async (payload) => {
  const { authProvider, personalData, verificationStatus, role, role_id, password, location, preferences } = payload;

  // Duplicate check for Email
  const existingEmail = await Member.findOneByEmail(personalData.email);
  if (existingEmail) {
    throw new BadRequestError('The request payload contains invalid or missing data.', 'VALIDATION_FAILED', [
      {
        field: 'personalData.email',
        rejectedValue: personalData.email,
        reason: 'A user profile already exists with this email address.'
      }
    ]); 
  }

  // Duplicate check for Phone
  const existingPhone = await Member.findOneByPhone(personalData.phoneNumber);
  if (existingPhone) {
    throw new BadRequestError('The request payload contains invalid or missing data.', 'VALIDATION_FAILED', [
      {
        field: 'personalData.phoneNumber',
        rejectedValue: personalData.phoneNumber,
        reason: 'A user profile already exists with this phone number.'
      }
    ]);
  }

  // Map role type to numeric member_id (1 = VENUE_OWNER, 2 = USER)
  let member_id = 2; // Default to USER (2)
  let resolvedRole = 'USER';

  if (typeof role_id === 'number') {
    if (role_id === 3) {
      member_id = 1; // VENUE_OWNER in Firestore database
      resolvedRole = 'VENUE_OWNER';
    } else {
      member_id = 2; // USER in Firestore database
      resolvedRole = 'USER';
    }
  } else {
    // Fallback to legacy string role check
    const roleName = typeof role === 'object' && role !== null ? role.id : role;
    if (roleName === 'VENUE_OWNER') {
      member_id = 1;
      resolvedRole = 'VENUE_OWNER';
    } else if (roleName === 'ADMIN') {
      member_id = 2;
      resolvedRole = 'ADMIN';
    } else {
      member_id = 2;
      resolvedRole = 'USER';
    }
  }

  const identifier = `${personalData.firstName}_${personalData.lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');

  // Create the member record payload
  const memberData = {
    email_id: personalData.email,
    identifier,
    member_id,
    phone_number: personalData.phoneNumber,
    credentials: {
      googile_auth_id: authProvider && authProvider.type === 'GOOGLE' ? authProvider.providerId : '',
      password: password ? await cryptoUtils.hashPassword(password) : ''
    },
    varification: {
      is_email: authProvider && authProvider.type === 'GOOGLE' ? true : (verificationStatus ? verificationStatus.isEmailVerified : false),
      is_google_auth: authProvider && authProvider.type === 'GOOGLE',
      is_mobile_number: verificationStatus ? verificationStatus.isPhoneVerified : false
    }
  };

  const member = await Member.create(memberData);

  const fullName = `${personalData.firstName} ${personalData.lastName}`;

  // Save profile to corresponding collection based on role (member_id)
  if (member_id === 1) {
    const venueOwner = new VenueOwner({
      _id: member.id,
      name: fullName,
      email: personalData.email,
      phone_number: personalData.phoneNumber,
      location: location || null,
      preferences: preferences || null
    });
    await venueOwner.save();
  } else {
    const user = new User({
      _id: member.id,
      name: fullName,
      email: personalData.email,
      role: resolvedRole === 'ADMIN' ? 'admin' : 'user',
      location: location || null,
      preferences: preferences || null
    });
    await user.save();
  }

  return member;
};

module.exports = {
  createOnboardingAccount
};
