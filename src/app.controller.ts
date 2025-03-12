import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('get_lanes')
  getLanes(): string[] {
    return this.appService.getLanes();
  }

  @Get('get_questions')
  getQuestions(@Query('category') category: string,
    @Query('lane') lane?: string): string[] {
    return this.appService.getQuestions(category, lane);
  }

}
