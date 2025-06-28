import { Module } from '@nestjs/common';
import { CvParserModule } from './modules/cv-parser/cv-parser.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CvParserModule, ConfigModule.forRoot({isGlobal:true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
