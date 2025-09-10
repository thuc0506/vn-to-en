// lesson.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';
import { VideoLesson } from '../entities/video-lesson.entity';
import { TranslateLesson } from '../entities/translate-lesson.entity';


@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,

    @InjectRepository(VideoLesson)
    private videoLessonRepo: Repository<VideoLesson>,

    // @InjectRepository(AudioLesson)
    // private audioLessonRepo: Repository<AudioLesson>,

    @InjectRepository(TranslateLesson)
    private translateLessonRepo: Repository<TranslateLesson>,
  ) {}

  async getLessonDetail(id: number) {
    const lesson = await this.lessonRepo.findOne({ where: { id } });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    switch (lesson.type) {
      case 'video': {
        const detail = await this.videoLessonRepo.findOne({ where: { lesson: { id } } });
        return { ...lesson, detail };
      }
    //   case 'audio': {
    //     const detail = await this.audioLessonRepo.findOne({ where: { lesson: { id } } });
    //     return { ...lesson, detail };
    //   }
      case 'translate': {
        const detail = await this.translateLessonRepo.findOne({ where: { lesson: { id } } });
        return { ...lesson, detail };
      }
      default:
        throw new NotFoundException('Loại bài học không hợp lệ');
    }
  }
}
