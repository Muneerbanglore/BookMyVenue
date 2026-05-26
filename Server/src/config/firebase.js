const admin = require('firebase-admin');
const logger = require('./logger');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

let db = null;

if (!projectId || !clientEmail || !privateKey) {
  logger.warn('Firebase configuration parameters are missing. Firestore is disabled.');
} else {
  try {
    // Clean and decode the private key string (replace escaped "\n" with real newline characters)
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    const formattedKey = privateKey.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      }),
    });

    db = admin.firestore();
    logger.info('Firebase Admin SDK initialized. Firestore database instance connected.');
  } catch (error) {
    logger.error(`Firebase initialization failed: ${error.message}`);
  }
}

module.exports = db;
