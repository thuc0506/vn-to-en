import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioLesson } from '../entities/audio.entity';
import { CreateAudioDto } from '../dto/audio-lesson.dto';
import { Lesson } from '../entities/lesson.entity';

@Injectable()
export class AudioLessonService {
  constructor(
    @InjectRepository(AudioLesson)
    private readonly audioLessonRepository: Repository<AudioLesson>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async createAudioLesson(createAudioDto: CreateAudioDto): Promise<AudioLesson> {
    const slug = createAudioDto.title
      ? createAudioDto.title.toLowerCase().replace(/\s+/g, '-')
      : 'audio-lesson';

    // Tạo Lesson trước
    const lesson = this.lessonRepository.create({
      title: createAudioDto.title,
      slug: slug,
      type: 'audio',
      section: null, // có thể null hoặc 1 object
    });

    await this.lessonRepository.save(lesson);

    // Tạo AudioLesson
    const audioLesson = this.audioLessonRepository.create({
      lesson,
      title: createAudioDto.title,
      url: createAudioDto.url ,
      transcript_path: createAudioDto.transcript_path,
    });

    return this.audioLessonRepository.save(audioLesson);
  }
}
