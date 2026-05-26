const db = require('../config/firebase');
const cryptoUtils = require('../utils/crypto');

class Member {
  constructor(data) {
    this._id = data.id || data._id;
    this.email_id = data.email_id || '';
    this.identifier = data.identifier || '';
    this.member_id = data.member_id || 2; // Default to 2 (USER)
    
    // Convert phone_number to number if it's a string, or default to 0
    if (typeof data.phone_number === 'string') {
      const sanitized = data.phone_number.replace(/\D/g, '');
      this.phone_number = sanitized ? Number(sanitized) : 0;
    } else {
      this.phone_number = typeof data.phone_number === 'number' ? data.phone_number : 0;
    }

    this.credentials = {
      googile_auth_id: (data.credentials && data.credentials.googile_auth_id) || '',
      password: (data.credentials && data.credentials.password) || ''
    };

    // Spelled 'varification' exactly as requested by user / database screenshots
    this.varification = {
      is_email: (data.varification && data.varification.is_email) || false,
      is_google_auth: (data.varification && data.varification.is_google_auth) || false,
      is_mobile_number: (data.varification && data.varification.is_mobile_number) || false
    };

    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  get id() {
    return this._id;
  }

  /**
   * Save or update the member document in Firestore
   */
  async save() {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const payload = {
      email_id: this.email_id,
      identifier: this.identifier,
      member_id: this.member_id,
      phone_number: this.phone_number,
      credentials: this.credentials,
      varification: this.varification,
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString()
    };

    await db.collection('members').doc(this._id).set(payload, { merge: true });
    return this;
  }

  // Static Helper Methods

  /**
   * Find a member by email ID
   */
  static async findOneByEmail(email) {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const snapshot = await db
      .collection('members')
      .where('email_id', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return new Member({ _id: doc.id, ...doc.data() });
  }

  /**
   * Find a member by phone number (number)
   */
  static async findOneByPhone(phoneNumber) {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    let phoneVal = 0;
    if (typeof phoneNumber === 'string') {
      const sanitized = phoneNumber.replace(/\D/g, '');
      phoneVal = sanitized ? Number(sanitized) : 0;
    } else if (typeof phoneNumber === 'number') {
      phoneVal = phoneNumber;
    }

    if (phoneVal === 0) return null;

    const snapshot = await db
      .collection('members')
      .where('phone_number', '==', phoneVal)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return new Member({ _id: doc.id, ...doc.data() });
  }

  /**
   * Find a member by their document ID
   */
  static async findById(id) {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const doc = await db.collection('members').doc(id).get();
    if (!doc.exists) {
      return null;
    }

    return new Member({ _id: doc.id, ...doc.data() });
  }

  /**
   * Create a new member record in the members collection
   */
  static async create(memberData) {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const membersRef = db.collection('members');
    const docRef = membersRef.doc(); // Auto-generate ID

    const member = new Member({ _id: docRef.id, ...memberData });
    await member.save();
    return member;
  }
}

module.exports = Member;
