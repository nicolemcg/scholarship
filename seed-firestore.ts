import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const firestore = admin.firestore();

async function seedFirestore() {
  // 1. Insertar un usuario
  const userId = 'user-001';
  const userData = {
    nationality: 'Bolivian',
    country_of_residence: 'Bolivia',
    fields_of_interest: ['Engineering', 'Environment'],
    languages: [{ language: 'English', level: 'B2' }],
    preferred_modalities: ['online'],
    preferred_destinations: ['Germany', 'Canada'],
    personal_goals: ['renewable energy']
  };

  await firestore.collection('users').doc(userId).set(userData);
  console.log(`✅ Usuario '${userId}' creado`);

  // 2. Insertar becas
  const fakeEmbedding = Array(1536).fill(0).map(() => Math.random());

  const scholarships = [
    {
      id: 'scholarship-001',
      title: 'Women in STEM - Germany',
      scholarship_type: 'full',
      deadline: '2025-09-01',
      destination_country: 'Germany',
      modality: 'online',
      academic_fields: ['Engineering'],
      allowed_nationalities: ['Bolivian', 'Peruvian'],
      required_languages: [{ language: 'English', level: 'B2' }],
      embedding: fakeEmbedding
    },
    {
      id: 'scholarship-002',
      title: 'Climate Change Scholars - Canada',
      scholarship_type: 'partial',
      deadline: '2025-08-15',
      destination_country: 'Canada',
      modality: 'online',
      academic_fields: ['Environment'],
      allowed_nationalities: ['Bolivian'],
      required_languages: [{ language: 'English', level: 'B2' }],
      embedding: fakeEmbedding
    }
  ];

  for (const s of scholarships) {
    await firestore.collection('scholarships').doc(s.id).set(s);
    console.log(`✅ Beca '${s.id}' insertada`);
  }

  console.log('🎉 Base de datos cargada con datos de prueba.');
}

seedFirestore().catch(console.error);
