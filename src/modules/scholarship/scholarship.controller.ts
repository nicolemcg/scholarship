import { Controller, Get } from '@nestjs/common';
import { ScholarshipService } from './scholarship.service';

@Controller('scholarship')
export class ScholarshipController {
    constructor(private readonly scholarshipService: ScholarshipService) {}

    @Get('load') // Al hacer GET /scholarship/load, se procesan las URLs
        async loadScholarships(): Promise<any[]> {
        return this.scholarshipService.extractAllScholarships();
  }
}
