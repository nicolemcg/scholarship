import { Controller, Get, Param } from '@nestjs/common';
import { RecommenderService } from './recommender.service';

@Controller('recommendations')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Get(':userId')
  async recommend(@Param('userId') userId: string) {
    return this.recommenderService.recommendScholarships(userId);
  }
}
