import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CvParserModule } from './modules/cv-parser/cv-parser.module';

import { FirebaseModule } from './firebase/firebase.module';
import { ScholarshipModule } from './modules/scholarship/scholarship.module';

@Module({
  imports: [CvParserModule, ConfigModule.forRoot({ // <-- Add this line
      isGlobal: true, // Makes the ConfigService available globally
    }),FirebaseModule, ScholarshipModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
