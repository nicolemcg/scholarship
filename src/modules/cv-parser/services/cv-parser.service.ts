import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin'; // Importa firebase-admin para usar FieldValue.serverTimestamp()
import { FirebaseService } from 'src/firebase/firebase.service'; // Asegúrate que la ruta sea correcta


@Injectable()
export class CvService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private readonly collectionName = 'parsed_cvs';

  constructor(
    private readonly firebaseService: FirebaseService,
  ) {
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set. Please provide it.');
    }
    this.genAI = new GoogleGenerativeAI(geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `
        Eres un experto en reclutamiento analizando CVs para postulaciones de becas. 
        Tu única tarea es extraer los siguientes datos en formato JSON.
        ES CRUCIAL que la salida sea un OBJETO JSON VÁLIDO y ESTRICTO, sin comas extra o errores de sintaxis.
        NO incluyas ningún otro texto o explicación, SOLO el objeto JSON.
        
        El formato DEBE ser exactamente:
        {
          "nombre_completo": string,
          "edad": number | null,
          "fecha_nacimiento": string | null,
          "email": string,
          "contacto": string | null,
          "ubicacion": string,
          "carrera": string,
          "experiencia_laboral": [{empresa: string, puesto: string, periodo: string}, {empresa: string, puesto: string, periodo: string}], // <-- Explicit example here!
          "sexo": "Masculino" | "Femenino" | "Otro" | "No especificado",
          "estudios_postgrado": [{institucion: string, titulo: string}],
          "voluntariados": [{organizacion: string, rol: string}],
          "skills": string[],
          "idiomas": [{idioma: string, nivel: string}]
        }
        
        Reglas:
        1. Si no encuentras un dato, usa null
        2. Para edad y fecha nacimiento: extraer AMBAS si es posible
        3. Contacto puede incluir teléfono o alternativas
        4. Sexo solo si está EXPLÍCITAMENTE mencionado
        5. Usa EXACTAMENTE estos nombres de campos
        6. Asegúrate de que TODAS las claves y cadenas de texto en el JSON estén entre comillas dobles.
      `
    });
  }

  async processCV(filePath: string): Promise<any> {
    let parsedCvData: any;

    try {
      // Leer el archivo PDF
      const pdfFile = fs.readFileSync(path.resolve(filePath));
      const base64Data = pdfFile.toString('base64');

      // Configurar el documento para Gemini (esto está bien)
      const document = {
        mimeType: 'application/pdf',
        data: base64Data
      };

      // Prompt para extracción (esto está bien)
      const prompt = "Procesa el CV y devuelve SOLO el JSON con los datos solicitados";

      // --- ¡La corrección está aquí! ---
      const result = await this.model.generateContent([
        { text: prompt },        // El prompt es una parte de texto
        { inlineData: document } // El documento es una parte de inlineData
      ]);
      // --- Fin de la corrección ---

      const response = result.response;
      const text = response.text();

      // Limpiar respuesta y convertir a JSON
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);

      try {
        parsedCvData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Error parsing JSON from Gemini response:', parseError);
        console.error('Raw Gemini text response (for debug):', text);
        throw new Error('Could not parse JSON from CV analysis. Invalid format received from AI.');
      }

       const collectionName = 'parsed_cvs'; // Puedes elegir el nombre de tu colección
      const docRef = await this.firebaseService.db.collection(collectionName).add({
        ...parsedCvData,
        processedAt: admin.firestore.FieldValue.serverTimestamp(), // Añade un timestamp
        originalFileName: path.basename(filePath) // Opcional: guardar el nombre original del archivo
      });
      console.log(`Datos del CV guardados en Firestore con ID: ${docRef.id} en la colección ${collectionName}`);
      
      return {
        firebaseDocId: docRef.id, // Devuelve el ID del documento de Firebase
        data: parsedCvData // Y los datos parseados
      };
    } catch (error) {
      console.error('Error procesando CV:', error);
      throw new Error('Error al procesar el CV');
    } finally {
      // Eliminar archivo temporal
      fs.unlinkSync(filePath);
    }
  }

  async findAllParsedCvs(): Promise<any[]> {
    try {
      const snapshot = await this.firebaseService.db.collection(this.collectionName).get();
      const cvs: any[] = [];
      snapshot.forEach(doc => {
        // Asegúrate de incluir el ID del documento
        cvs.push({ id: doc.id, ...doc.data() });
      });
      return cvs;
    } catch (error) {
      console.error('Error fetching all parsed CVs from Firestore:', error);
      throw new Error('Failed to retrieve parsed CVs.');
    }
  }

  async findParsedCvById(id: string): Promise<any> {
    try {
      const doc = await this.firebaseService.db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) {
        throw new NotFoundException(`Parsed CV with ID ${id} not found.`);
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error(`Error fetching parsed CV with ID ${id} from Firestore:`, error);
      // Si el error ya es un NotFoundException, relánzalo
      if (error instanceof NotFoundException) {
          throw error;
      }
      throw new Error('Failed to retrieve parsed CV by ID.');
    }
  }

  async updateParsedCv(id: string, updateData: any): Promise<any> {
    try {
      const cvRef = this.firebaseService.db.collection(this.collectionName).doc(id);
      const doc = await cvRef.get();

      if (!doc.exists) {
        throw new NotFoundException(`Parsed CV with ID ${id} not found.`);
      }

      // Realiza la actualización de los campos proporcionados
      await cvRef.update(updateData);

      // Opcional: Recupera el documento completo actualizado para devolverlo
      const updatedDoc = await cvRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };

    } catch (error) {
      console.error(`Error updating parsed CV with ID ${id} in Firestore:`, error);
      // Si ya es un NotFoundException, relánzalo
      if (error instanceof NotFoundException) {
          throw error;
      }
      throw new Error('Failed to update parsed CV.');
    }
  }
}