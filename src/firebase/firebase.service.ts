// src/firebase/firebase.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { firestore } from '../config/firebase'; 

@Injectable()
export class FirebaseService implements OnModuleInit, OnModuleDestroy {
  private _db: admin.firestore.Firestore;
  //private firebaseApp: admin.app.App;

  onModuleInit() {
    try {
      
      this._db = firestore;
      console.log('Firebase Admin SDK initialized successfully.');

    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error.message);
      // Es crucial que la aplicación no continúe si Firebase no se inicializa
      throw new Error('Failed to initialize Firebase Admin SDK. Check your FIREBASE_SERVICE_ACCOUNT_KEY_PATH and JSON file.');
    }
  }

  onModuleDestroy() {
    // Opcional: Cierre explícito de la aplicación Firebase si es necesario.
    // En la mayoría de los casos de NestJS, no es estrictamente necesario,
    // ya que el proceso de Node.js se cerrará, pero es una buena práctica para contextos más complejos.
    // if (this.firebaseApp) {
    //   this.firebaseApp.delete().then(() => {
    //     console.log('Firebase Admin SDK app deleted successfully.');
    //   }).catch(error => {
    //     console.error('Error deleting Firebase Admin SDK app:', error);
    //   });
    // }
    console.log('FirebaseService module destroyed.');
  }

  /**
   * Getter para la instancia de Firestore.
   * Otros servicios pueden inyectar FirebaseService y luego usar firebaseService.db
   */
  get db(): admin.firestore.Firestore {
    if (!this._db) {
      throw new Error('Firestore DB is not initialized. Ensure FirebaseService is properly set up and its onModuleInit has run.');
    }
    return this._db;
  }
}