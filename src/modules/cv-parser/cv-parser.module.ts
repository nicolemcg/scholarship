import { Module } from '@nestjs/common';
import { CvController } from './controllers/cv-parser.controller';
import { CvService } from './services/cv-parser.service';

@Module({
  controllers: [CvController],
  providers: [CvService,
    ],
})
export class CvParserModule {}