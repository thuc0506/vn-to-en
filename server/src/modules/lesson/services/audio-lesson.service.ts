import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioLesson } from '../entities/audio.entity';
import { CreateAudioDto } from '../dto/audio-lesson.dto';

import { Lesson } from '../entities/lesson.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AudioLessonService {
    constructor(
        @InjectRepository(AudioLesson) private readonly audioLessonRepository: Repository<AudioLesson>,
        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>,

    ) { }

    async createAudioLesson(createAudioDto: CreateAudioDto): Promise<AudioLesson> {


        const slug = createAudioDto.title ? createAudioDto.title.toLowerCase().replace(/\s+/g, '-') : 'audio-lesson';

        // Tạo lesson
        const lesson = this.lessonRepository.create({
            title: createAudioDto.title,
            slug: slug,
            type: 'audio',
            section: null // có thể null hoặc object
        });

        await this.lessonRepository.save(lesson);

        // Tạo audio lesson
        const audioLesson = this.audioLessonRepository.create({
            lesson,
            title: createAudioDto.title,
            url: createAudioDto.url || '',
            transcript_path: createAudioDto.transcript_path || null,
        });
        return this.audioLessonRepository.save(audioLesson);
    }

}
