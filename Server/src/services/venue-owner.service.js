const VenueOwner = require('../schemas/venue_owner.schema');
const Member = require('../schemas/member.schema');
const { encodeGeohash } = require('../utils/geohash');
const cryptoUtils = require('../utils/crypto');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const ErrorCodes = require('../constants/errorCodes');

/**
 * Retrieve venue owner profile merged with member credentials
 * @param {string} id - Venue Owner/Member ID
 */
const getVenueOwnerById = async (id) => {
  const member = await Member.findById(id);
  if (!member) {
    throw new NotFoundError('Member account not found.', ErrorCodes.USER_NOT_FOUND);
  }

  let owner = await VenueOwner.findById(id);
  if (!owner) {
    // Return skeleton profile populated from Member
    owner = new VenueOwner({
      _id: id,
      venue_name: member.identifier,
      role_id: 3
    });
  }

  return {
    id: owner.id,
    email: member.email_id,
    phone_number: member.phone_number ? `+${member.phone_number}` : '',
    venue_name: owner.venue_name,
    description: owner.description,
    established_year: owner.established_year,
    role_id: owner.role_id,
    main_image: owner.main_image,
    location: owner.location,
    images: owner.images,
    preferences: owner.preferences,
    venue_details: owner.venue_details,
    createdAt: owner.createdAt || member.createdAt,
    updatedAt: owner.updatedAt || member.updatedAt
  };
};

/**
 * Update venue owner profile details phase-by-phase
 * @param {string} id - Venue Owner/Member ID
 * @param {Object} updateData - Request body data
 * @param {string|number} phase - The phase being submitted (1, 2, or 4)
 */
const updateVenueOwnerProfile = async (id, updateData, phase) => {
  const member = await Member.findById(id);
  if (!member) {
    throw new NotFoundError('Member account not found.', ErrorCodes.USER_NOT_FOUND);
  }

  let owner = await VenueOwner.findById(id);
  if (!owner) {
    owner = new VenueOwner({ _id: id });
  }

  const phaseNum = parseInt(phase, 10);

  if (phaseNum === 1) {
    // Phase 1 updates organization details
    if (updateData.venue_name !== undefined) owner.venue_name = updateData.venue_name;
    if (updateData.description !== undefined) owner.description = updateData.description;
    if (updateData.established_year !== undefined) owner.established_year = updateData.established_year;
    if (updateData.main_image !== undefined) owner.main_image = updateData.main_image;

    // Handle password update if provided
    if (updateData.password) {
      const hashedPassword = await cryptoUtils.hashPassword(updateData.password);
      member.credentials.password = hashedPassword;
    }

    // Sync identifier with members collection
    if (updateData.venue_name) {
      const identifier = updateData.venue_name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/^_+|_+$/g, ''); // Trim leading/trailing underscores
      
      if (identifier) {
        member.identifier = identifier;
      }
    }
  } 
  else if (phaseNum === 2) {
    // Phase 2 updates location details with geohashing
    if (updateData.location !== undefined) {
      owner.location = {
        ...owner.location,
        ...updateData.location
      };

      if (updateData.location.coordinates) {
        const { latitude, longitude } = updateData.location.coordinates;
        owner.location.geohash = encodeGeohash(latitude, longitude, 9);
      }
    }
  } 
  else if (phaseNum === 4) {
    // Phase 4 updates specific venue details and preferences
    if (updateData.preferences !== undefined) {
      owner.preferences = {
        ...owner.preferences,
        ...updateData.preferences
      };
    }

    if (updateData.venue_details !== undefined) {
      owner.venue_details = {
        ...owner.venue_details,
        ...updateData.venue_details
      };
    }
  } 
  else {
    throw new BadRequestError('Invalid profile phase specified. Valid phases are 1, 2, or 4.', 'VALIDATION_FAILED');
  }

  // Save changes to Firestore database
  await owner.save();
  await member.save();

  // Return the unified updated profile payload
  return getVenueOwnerById(id);
};

module.exports = {
  getVenueOwnerById,
  updateVenueOwnerProfile
};
