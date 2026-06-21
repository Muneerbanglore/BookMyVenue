const db = require('../config/firebase');

class User {
  constructor(data) {
    this._id = data.id || data._id;
    this.first_name = data.first_name || '';
    this.last_name = data.last_name || '';
    this.profile_image = data.profile_image || '';
    this.role_id = data.role_id || 2; // default USER role id
    this.dob = data.dob || '';
    this.gender = data.gender || '';
    this.location = data.location || null;
    this.preferences = data.preferences || null;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get id() {
    return this._id;
  }

  /**
   * Save user state to Firestore database
   */
  async save() {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const payload = {
      first_name: this.first_name,
      last_name: this.last_name,
      profile_image: this.profile_image,
      role_id: this.role_id,
      dob: this.dob,
      gender: this.gender,
      location: this.location,
      preferences: this.preferences,
      createdAt: this.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('users').doc(this._id).set(payload, { merge: true });
    return this;
  }

  // Static Methods

  /**
   * Find a user by their document ID
   */
  static async findById(id) {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
      return null;
    }

    return new User({ _id: doc.id, ...doc.data() });
  }
}

module.exports = User;
