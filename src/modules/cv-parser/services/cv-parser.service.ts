import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CvService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
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
        NO incluyas ningún otro texto o explicación, SOLO el objeto JSON.
        {
          "nombre_completo": string,
          "edad": number | null,
          "fecha_nacimiento": string | null,
          "email": string,
          "contacto": string | null,
          "ubicacion": string,
          "carrera": string,
          "experiencia_laboral": {empresa: string, puesto: string, periodo: string}[],
          "sexo": "Masculino" | "Femenino" | "Otro" | "No especificado",
          "estudios_postgrado": {institucion: string, titulo: string}[],
          "voluntariados": {organizacion: string, rol: string}[],
          "skills": string[],
          "idiomas": {idioma: string, nivel: string}[]
        }
        
        Reglas:
        1. Si no encuentras un dato, usa null
        2. Para edad y fecha nacimiento: extraer AMBAS si es posible
        3. Contacto puede incluir teléfono o alternativas
        4. Sexo solo si está EXPLÍCITAMENTE mencionado
        5. Usa EXACTAMENTE estos nombres de campos
      `
    });
  }

  async processCV(filePath: string): Promise<any> {
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
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Error parsing JSON from Gemini response:', parseError);
        console.error('Raw Gemini text response (for debug):', text);
        throw new Error('Could not parse JSON from CV analysis. Invalid format received from AI.');
      }
    } catch (error) {
      console.error('Error procesando CV:', error);
      throw new Error('Error al procesar el CV');
    } finally {
      // Eliminar archivo temporal
      fs.unlinkSync(filePath);
    }
  }
}