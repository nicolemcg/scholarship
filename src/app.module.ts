import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CvParserModule } from './modules/cv-parser/cv-parser.module';

import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [CvParserModule, ConfigModule.forRoot({ // <-- Add this line
      isGlobal: true, // Makes the ConfigService available globally
    }),FirebaseModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
