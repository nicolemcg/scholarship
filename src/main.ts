import * as dotenv from 'dotenv';
dotenv.config(); // ✅ Esto debe ir ANTES de cualquier acceso a process.env

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
