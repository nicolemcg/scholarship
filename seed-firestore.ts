import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const firestore = admin.firestore();

// 🔧 Utilidad para generar vectores de 1024 dimensiones
function generateFakeEmbedding(size = 1024): number[] {
  return Array.from({ length: size }, () => Math.random());
}

async function seedFirestore() {
  // 📌 Usuario de prueba (UserProfileDTO)
  const userId = 'user-001';
  const userData = {
    id: userId,
    current_education_level: 'Licenciatura',
    fields_of_interest: ['Ingeniería de Sistemas', 'Medio Ambiente'],
    languages: [
      { language: 'Inglés', level: 'B2' },
      { language: 'Español', level: 'C1' }
    ],
    country_of_residence: 'Bolivia',
    nationality: 'Boliviana',
    academic_average: 85.6,
    work_experience: {
      years: 2,
      areas: ['tecnología', 'educación']
    },
    available_to_travel: true,
    preferred_modalities: ['online', 'presencial'],
    preferred_destinations: ['Alemania', 'Canadá'],
    personal_goals: ['sostenibilidad', 'inteligencia artificial'],
    economic_situation: 'media',
    extra_certifications: ['Certificado en energías renovables']
  };

  await firestore.collection('users').doc(userId).set(userData);
  console.log(`✅ Usuario '${userId}' creado`);

  // 🎓 Becas de prueba (ScholarshipDTO)
  const scholarships = [
    {
      id: 'scholarship-001',
      title: 'Women in STEM - Alemania',
      required_education_level: 'Licenciatura',
      academic_fields: ['Ingeniería', 'Tecnología'],
      required_languages: [{ language: 'Inglés', level: 'B2' }],
      destination_country: 'Alemania',
      modality: 'online',
      duration: 12,
      benefits: ['Matrícula completa', 'Estipendio mensual'],
      allowed_nationalities: ['Boliviana', 'Peruana'],
      deadline: '2025-09-01',
      additional_requirements: ['Ser mujer', 'Conocimiento básico en programación'],
      scholarship_type: 'completa',
      application_link: 'https://becas-ejemplo.com/stem-alemania',
      embedding: generateFakeEmbedding(),
    },
    {
      id: 'scholarship-002',
      title: 'Becas de Cambio Climático - Canadá',
      required_education_level: 'Licenciatura',
      academic_fields: ['Medio Ambiente', 'Sostenibilidad'],
      required_languages: [{ language: 'Inglés', level: 'B2' }],
      destination_country: 'Canadá',
      modality: 'presencial',
      duration: 18,
      benefits: ['Alojamiento', 'Alimentación', 'Seguro médico'],
      allowed_nationalities: ['Boliviana', 'Ecuatoriana'],
      deadline: '2025-08-15',
      additional_requirements: ['Carta de motivación', 'Experiencia en voluntariado'],
      scholarship_type: 'parcial',
      application_link: 'https://becas-ejemplo.com/clima-canada',
      embedding: generateFakeEmbedding(),
    }
  ];

  for (const s of scholarships) {
    await firestore.collection('scholarships').doc(s.id).set(s);
    console.log(`✅ Beca '${s.id}' insertada`);
  }

  console.log('🎉 Seed completado con usuario y becas.');
}

seedFirestore().catch(console.error);
