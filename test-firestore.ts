import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config(); // Carga las variables de entorno

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const firestore = admin.firestore();

async function test() {
  try {
    const snapshot = await firestore.collection('users').limit(1).get();

    if (!snapshot.empty) {
      console.log("✅ Conectado a Firestore. Documento encontrado:");
      snapshot.docs.forEach(doc => {
        console.log(`🗂️ ID: ${doc.id}`);
        console.log(`📄 Data:`, doc.data());
      });
    } else {
      console.log("⚠️ Conectado, pero la colección 'users' está vacía.");
    }

  } catch (error) {
    console.error("❌ Error al conectar con Firestore:", error.message);
  }
}

test();
