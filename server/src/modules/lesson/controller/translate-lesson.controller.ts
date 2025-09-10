import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TranslateLessonService } from '../services/translate-lesson.service';
import { CreateTextLessionDto } from '../dto/translate-lesson.dto';

@Controller('lession-text')
export class TranslateLessonController {
  constructor(private readonly lessionTextService: TranslateLessonService) { }
  @Post('/create-ai')
  async createByAI(@Body() dto: CreateTextLessionDto): Promise<any> {
    return this.lessionTextService.createWithAI(dto);
  }


  @Post('generate-hint')
  async generateHint(@Body('sentence') sentence: string, @Body('level') level: string) {
    return this.lessionTextService.generateHintBySentence(sentence, level);
  }

  @Post('check')
  async checkSentence(
    @Body('sentence') sentence: string,
    @Body('answer') answer: string,
    @Body('level') level: string,
  ) {
    return this.lessionTextService.checkAnswer(sentence, answer, level);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.lessionTextService.findById(id);
  }



}
