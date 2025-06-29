// src/firebase/firebase.module.ts
import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global() // Hace que FirebaseService esté disponible globalmente sin importarlo en cada módulo
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService], // Exporta el servicio para que pueda ser inyectado en otros módulos
})
export class FirebaseModule {}