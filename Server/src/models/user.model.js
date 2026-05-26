const db = require('../config/firebase');
const cryptoUtils = require('../utils/crypto');

class User {
  constructor(data) {
    this._id = data.id || data._id;
    this.name = data.name;
    this.email = data.email ? data.email.toLowerCase() : '';
    this._password = data.password;
    this.role = data.role || 'user';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this._passwordModified = false;
  }

  // Getters/setters for password
  get password() {
    return this._password;
  }

  set password(val) {
    this._password = val;
    this._passwordModified = true;
  }

  // Helper property to mirror Mongoose's id
  get id() {
    return this._id;
  }

  /**
   * Compare password entered by user against the hashed password
   */
  async matchPassword(enteredPassword) {
    if (!this.password) return false;
    return cryptoUtils.comparePassword(enteredPassword, this.password);
  }

  /**
   * Save user state to Firestore database
   */
  async save() {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    // Hash password if modified
    if (this._passwordModified && this.password) {
      this._password = await cryptoUtils.hashPassword(this.password);
      this._passwordModified = false;
    }

    const payload = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('users').doc(this._id).set(payload, { merge: true });
    return this;
  }

  // Static Methods

  /**
   * Find a user by their unique email address
   */
  static findOne(query) {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const email = query.email;
    if (!email) {
      throw new Error('findOne only supports querying by email in this implementation.');
    }

    return this._createChainableQuery(email);
  }

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

  /**
   * Create a new user record in Firestore
   */
  static async create(userData) {
    if (!db) {
      throw new Error('Firestore database is not initialized.');
    }

    const { name, email, password, role } = userData;
    const usersRef = db.collection('users');
    const docRef = usersRef.doc(); // Auto-generates ID

    const hashedPassword = await cryptoUtils.hashPassword(password);
    const now = new Date().toISOString();

    const newUserPayload = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'user',
      createdAt: now,
      updatedAt: now,
    };

    await docRef.set(newUserPayload);
    return new User({ _id: docRef.id, ...newUserPayload });
  }

  /**
   * Internal helper to support Mongoose-like select('+password') chaining
   */
  static _createChainableQuery(email) {
    const query = {
      select: () => query,
      catch: () => query,
      then: (resolve, reject) => {
        db.collection('users')
          .where('email', '==', email.toLowerCase())
          .limit(1)
          .get()
          .then((snapshot) => {
            if (snapshot.empty) {
              return resolve(null);
            }
            const doc = snapshot.docs[0];
            const user = new User({ _id: doc.id, ...doc.data() });
            resolve(user);
          })
          .catch((err) => {
            if (typeof reject === 'function') {
              reject(err);
            }
          });
      },
    };
    return query;
  }
}

module.exports = User;
