const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes in hex (64 chars)
const IV_LENGTH = 16; // AES block size in bytes

/**
 * Generates an encryption key buffer from hex or fallback
 */
const getEncryptionKey = () => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    // Generate a secure fallback key for testing/fallback (not recommended for production production)
    return crypto.scryptSync(process.env.JWT_SECRET || 'fallback_secret', 'salt', 32);
  }
  return Buffer.from(ENCRYPTION_KEY, 'hex');
};

const cryptoUtils = {
  /**
   * Hash a plain-text password using Bcrypt
   */
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  },

  /**
   * Compare plain-text password with stored hash
   */
  comparePassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  },

  /**
   * Generate a JWT containing user details (Access Token)
   */
  generateToken: (payload, expiresIn = '15m') => {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign(payload, secret, { expiresIn });
  },

  /**
   * Generate a secure long-lived Refresh Token
   */
  generateRefreshToken: (payload, expiresIn = '7d') => {
    const secret = process.env.JWT_SECRET || 'secret';
    const jti = crypto.randomBytes(16).toString('hex');
    return jwt.sign({ ...payload, jti }, secret, { expiresIn });
  },

  /**
   * Verify and decode a JWT
   */
  verifyToken: (token) => {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.verify(token, secret);
  },

  /**
   * Encrypt a text block using AES-256-CBC
   */
  encrypt: (text) => {
    try {
      const key = getEncryptionKey();
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  },

  /**
   * Decrypt an AES-256-CBC encrypted token string
   */
  decrypt: (encryptedText) => {
    try {
      const key = getEncryptionKey();
      const textParts = encryptedText.split(':');
      if (textParts.length < 2) {
        throw new Error('Invalid encrypted format');
      }
      const iv = Buffer.from(textParts.shift(), 'hex');
      const encryptedData = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }
};

module.exports = cryptoUtils;
