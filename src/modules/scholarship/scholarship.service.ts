import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseService } from '../../firebase/firebase.service';
import { ScholarshipUrls } from '../../enum/scholarships_url'; // ajusta la ruta

@Injectable()
export class ScholarshipService {
    private genAI: GoogleGenerativeAI;

  constructor(private readonly firebaseService: FirebaseService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está definida en las variables de entorno');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }


  private readonly scholarshipUrls: string[] = [
    'https://ejemplo.com/beca1',
    'https://ejemplo.com/beca2',
    'https://www.minedu.gob.bo/index.php?option=com_content&view=article&id=5552&catid=277&Itemid=1081'
  ];
  

  

  async extractScholarshipDataFromUrl(url: string): Promise<any> {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const text = $('body').text().replace(/\s+/g, ' ').trim();

    const prompt = `
    Eres un experto haciendo webscraping.
    Es necesrio que extraigas los siguientes datos en formato JSON
    NO incluyas ningún otro texto o explicación, SOLO el objeto JSON.
    Toma en cuenta que en un link puede encontrarse mas de una beca.
    Toma en cuenta que debes obtener informacion de los link y pdfs que encuentres ahi dentro

    Considera: 
    application_link es el link de donde obtuviste la informacion de una beca
    {
        "title": string,
        "required_education_level": string,
        "academic_fields": string,
        "required_languages": { language: string, level: string},
        "destination_country": string ,
        "modality": string, 
        "duration": string,
        "benefits": [string]
        "allowed_nationalities": [string],
        "deadline": string,
        "additional_requirements": [string],
        "scholarship_type": string,
        "application_link": ${url}
    }

    Text:
    """${text}"""
    `;

    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    console.log('Respuesta de Gemini:', textResponse);

    let cleanText = textResponse.trim();

    // Elimina posibles ```json ... ``` envoltorios
    if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json\s*/, '').replace(/```$/, '');
    }

    let scholarshipData: any;
    try {
    scholarshipData = JSON.parse(cleanText);
    } catch (error) {
    console.error('Texto inválido:', cleanText);
    throw new Error(`No se pudo parsear la respuesta de Gemini para ${url}`);
    }

    const db = this.firebaseService;
    await this.firebaseService.db.collection('scholarships').add({...scholarshipData});
    console.log(`Datos del CV guardados en Firestore `);
    return scholarshipData;
  }

  async extractAllScholarships(): Promise<any[]> {
    const results: any[] = [];
    const urls: string[] = Object.values(ScholarshipUrls);

    for (const url of urls) {
      try {
        const scholarship = await this.extractScholarshipDataFromUrl(url);
        results.push(scholarship);
      } catch (error) {
        console.error(`❌ Error con ${url}:`, error.message);
      }
    }
    return results;
  }
}
