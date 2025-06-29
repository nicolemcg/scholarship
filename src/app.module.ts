import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommenderModule } from './modules/recommender/recommender.module';
import { ConfigModule } from '@nestjs/config';
import { CvParserModule } from './modules/cv-parser/cv-parser.module';

import { FirebaseModule } from './firebase/firebase.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [CvParserModule,RecommenderModule, ConfigModule.forRoot({
      isGlobal: true, 
    }),FirebaseModule,],
})
export class AppModule {}
