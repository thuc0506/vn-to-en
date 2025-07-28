import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LessonService } from '../services/lesson.service';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get(':id')
  async getLessonDetail(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.getLessonDetail(id);
  }
}
