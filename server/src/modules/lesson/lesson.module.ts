import { Module } from '@nestjs/common';
import { LessonController } from './controller/lesson.controller';
import { LessonService } from './services/lesson.service';
import { VideoLessonController } from './controller/video-lesson.controller';
import { VideoLessonService } from './services/video-lesson.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoLesson } from './entities/video-lesson.entity';
import { Lesson } from './entities/lesson.entity';    


@Module({
   imports: [TypeOrmModule.forFeature([VideoLesson, Lesson])],
  controllers: [LessonController, VideoLessonController],
  providers: [LessonService, VideoLessonService],
})
export class LessonModule {}
