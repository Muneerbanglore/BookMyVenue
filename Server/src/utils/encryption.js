const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes in hex (64 chars) or fallback 32-character string
const IV_LENGTH = 16; // AES block size in bytes

const getEncryptionKey = () => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    // Return a default 32-byte key for development fallback
    return Buffer.from('12345678901234567890123456789012', 'utf8');
  }
  return Buffer.from(ENCRYPTION_KEY, 'hex');
};

/**
 * Encrypt a JS object or string using AES-256-CBC
 */
const encryptPayload = (data) => {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
    let encrypted = cipher.update(stringifiedData, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return {
      iv: iv.toString('base64'),
      encryptedData: encrypted
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt an AES-256-CBC encrypted payload
 */
const decryptPayload = (payload) => {
  try {
    const { iv, encryptedData } = payload;
    if (!iv || !encryptedData) {
      throw new Error('Invalid encrypted payload format');
    }

    const key = getEncryptionKey();
    const ivBuffer = Buffer.from(iv, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuffer);

    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

module.exports = {
  encryptPayload,
  decryptPayload
};
