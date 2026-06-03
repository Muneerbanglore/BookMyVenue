require('dotenv').config();
const db = require('../config/firebase');
const logger = require('../config/logger');
const masterData = require('../constants/onboardingMasterData');

const seedCollection = async (collectionName, dataArray, keySelector) => {
  if (!db) {
    logger.error('Firebase DB is not initialized. Cannot seed.');
    return;
  }
  
  logger.info(`Starting seeding for collection: ${collectionName}...`);
  const collectionRef = db.collection(collectionName);
  
  try {
    for (const item of dataArray) {
      let docId;
      let docData;
      
      if (typeof item === 'string') {
        docId = item;
        docData = { value: item };
      } else {
        docId = item[keySelector];
        // Clean timezone names if they are used as IDs to avoid path issues
        if (collectionName === 'timezones') {
          docId = docId.replace(/\//g, '_');
        }
        docData = item;
      }
      
      await collectionRef.doc(docId).set(docData);
      logger.info(`Seeded document in ${collectionName}: ${docId}`);
    }
    logger.info(`Successfully completed seeding for collection: ${collectionName}`);
  } catch (error) {
    logger.error(`Failed to seed collection ${collectionName}: ${error.message}`);
  }
};

const run = async () => {
  if (!db) {
    logger.error('Database connection failed. Please check your .env variables.');
    process.exit(1);
  }
  
  await seedCollection('countries', masterData.countries, 'code');
  await seedCollection('currencies', masterData.currencies, 'code');
  await seedCollection('timezones', masterData.timezones, 'name');
  await seedCollection('themes', masterData.themes);
  await seedCollection('locales', masterData.locales);
  
  logger.info('Database seeding completed successfully!');
  process.exit(0);
};

run();
