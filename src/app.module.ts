import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommenderModule } from './modules/recommender/recommender.module';
import { ConfigModule } from '@nestjs/config';
import { CvParserModule } from './modules/cv-parser/cv-parser.module';

import { FirebaseModule } from './firebase/firebase.module';
import { ScholarshipModule } from './modules/scholarship/scholarship.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [CvParserModule,RecommenderModule, ConfigModule.forRoot({ // <-- Add this line
      isGlobal: true, // Makes the ConfigService available globally
<<<<<<< HEAD
    }),FirebaseModule, ScholarshipModule,],
  controllers: [],
  providers: [],
=======
    }),FirebaseModule,],
>>>>>>> 5f13c01af4f9b3691ee88b067cbd6f7a32df86e1
})
export class AppModule {}
