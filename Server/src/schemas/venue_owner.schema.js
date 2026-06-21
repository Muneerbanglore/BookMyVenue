const db = require('../config/firebase');

class VenueOwner {
  constructor(data) {
    this._id = data.id || data._id;
    this.venue_name = data.venue_name || '';
    this.description = data.description || '';
    this.established_year = data.established_year || null;
    this.main_image = data.main_image || '';
    this.role_id = data.role_id || 3; // default Venue Owner role id
    this.preferences = data.preferences || {
      theme: 'light',
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      currency: 'INR'
    };
    this.location = data.location || null;
    this.images = data.images || {
      interior: [],
      exterior: [],
      facilities: []
    };
    this.venue_details = data.venue_details || {
      seatingCapacity: 0,
      floatingCapacity: 0,
      diningCapacity: 0,
      roomsAvailable: 0,
      parkingArea: '',
      timing: { open: '', close: '' },
      rentalCost: '',
      cancellationPolicy: '',
      ac: false,
      nonAc: false,
      cctv: false,
      security: '',
      wifi: false,
      powerBackup: false,
      soundSystem: false,
      stage: false,
      projector: false,
      inHouseCatering: false,
      externalCateringAllowed: false,
      inHouseDecoration: false,
      externalDecorationAllowed: false,
      alcoholAllowed: false,
      wheelchairAccessible: false,
      valetParking: false,
      kitchenAvailable: false
    };
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get id() {
    return this._id;
  }

  /**
   * Save venue owner state to Firestore database
   */
  async save() {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const payload = {
      venue_name: this.venue_name,
      description: this.description,
      established_year: this.established_year,
      main_image: this.main_image,
      role_id: this.role_id,
      preferences: this.preferences,
      location: this.location,
      images: this.images,
      venue_details: this.venue_details,
      createdAt: this.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('venue_owners').doc(this._id).set(payload, { merge: true });
    return this;
  }

  // Static Methods

  /**
   * Find a venue owner by their document ID
   */
  static async findById(id) {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const doc = await db.collection('venue_owners').doc(id).get();
    if (!doc.exists) {
      return null;
    }

    return new VenueOwner({ _id: doc.id, ...doc.data() });
  }
}

module.exports = VenueOwner;
