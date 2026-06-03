require('dotenv').config();
const db = require('../config/firebase');

const email = process.argv[2];

if (!email) {
  console.error('Error: Please provide an email address to delete. Example: node src/scripts/delete_test_user.js test@example.com');
  process.exit(1);
}

if (!db) {
  console.error('Error: Firestore database is not initialized. Check your environment variables.');
  process.exit(1);
}

async function run() {
  console.log(`Searching for member with email: ${email}...`);
  const lowerEmail = email.toLowerCase();
  
  const memberSnapshot = await db.collection('members')
    .where('email_id', '==', lowerEmail)
    .get();

  if (memberSnapshot.empty) {
    console.log(`No member found with email: ${email}`);
    process.exit(0);
  }

  for (const doc of memberSnapshot.docs) {
    const memberId = doc.id;
    console.log(`Found member ID: ${memberId}. Deleting related documents...`);
    
    // Delete from members
    await db.collection('members').doc(memberId).delete();
    console.log(`- Deleted member credentials doc (${memberId})`);

    // Delete from users
    await db.collection('users').doc(memberId).delete();
    console.log(`- Deleted user profile doc (${memberId})`);

    // Delete from venue_owners
    await db.collection('venue_owners').doc(memberId).delete();
    console.log(`- Deleted venue owner profile doc (${memberId})`);
  }

  console.log('All matching records deleted successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error('Failed to delete user:', err);
  process.exit(1);
});
