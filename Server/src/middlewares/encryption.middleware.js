const { decryptPayload, encryptPayload } = require('../utils/encryption');

const encryptionMiddleware = (req, res, next) => {
  // Check if incoming payload is encrypted
  if (req.body && req.body.encryptedData && req.body.iv) {
    try {
      // Decrypt request payload transparently
      req.body = decryptPayload(req.body);
      // Flag request so the response is encrypted back
      req.isEncrypted = true;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Decryption failed: ' + err.message
      });
    }
  }

  // Intercept res.json to automatically encrypt outgoing responses if flagged
  const originalJson = res.json;
  res.json = function (data) {
    if (req.isEncrypted) {
      try {
        const encrypted = encryptPayload(data);
        res.setHeader('Content-Type', 'application/json');
        return originalJson.call(this, encrypted);
      } catch (err) {
        return originalJson.call(this, {
          success: false,
          message: 'Response encryption failed: ' + err.message
        });
      }
    }
    // Return standard plain text JSON if request wasn't encrypted
    return originalJson.call(this, data);
  };

  next();
};

module.exports = encryptionMiddleware;
