const db = require('../config/firebase');

class VenueOwner {
  constructor(data) {
    this._id = data.id || data._id;
    this.name = data.name || '';
    this.email = data.email ? data.email.toLowerCase() : '';
    this.phone_number = data.phone_number || '';
    this.location = data.location || null;
    this.preferences = data.preferences || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
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
      name: this.name,
      email: this.email,
      phone_number: this.phone_number,
      location: this.location,
      preferences: this.preferences,
      createdAt: this.createdAt,
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
