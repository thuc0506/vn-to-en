import { Module } from '@nestjs/common';
import { LessonController } from './controller/lesson.controller';
import { LessonService } from './services/lesson.service';
import { VideoLessonController } from './controller/video-lesson.controller';
import { VideoLessonService } from './services/video-lesson.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoLesson } from './entities/video-lesson.entity';
import { Lesson } from './entities/lesson.entity';
import { AudioLesson } from './entities/audio.entity';
import { AudioLessonService } from './services/audio-lesson.service';
import { AudioLessonController } from './controller/audio-lesson.controller';
import { TranslateLesson } from './entities/translate-lesson.entity';
import { TranslateLessonService } from './services/translate-lesson.service';
import { TranslateLessonController } from './controller/translate-lesson.controller';
import { AiService } from '../ai/ai.service';



@Module({
  imports: [TypeOrmModule.forFeature([VideoLesson, AudioLesson, Lesson, TranslateLesson, ])],
  controllers: [LessonController, VideoLessonController, AudioLessonController, TranslateLessonController],
  providers: [LessonService, VideoLessonService, AudioLessonService, TranslateLessonService, AiService],
})
export class LessonModule { }
