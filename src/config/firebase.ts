import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const firestore = admin.firestore();
