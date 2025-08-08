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


@Module({
  imports: [TypeOrmModule.forFeature([VideoLesson, AudioLesson, Lesson])],
  controllers: [LessonController, VideoLessonController, AudioLessonController],
  providers: [LessonService, VideoLessonService, AudioLessonService],
})
export class LessonModule { }
