import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AudioLesson } from '../entities/audio.entity';
import { AudioLessonService } from '../services/audio-lesson.service';
import { CreateAudioDto } from '../dto/audio-lesson.dto';


@Controller('audio-lesson')
export class AudioLessonController {
    constructor(private readonly audioLessonService: AudioLessonService) { }

    // Route để tạo audio lesson mới
    @Post('create')
    async createAudioLesson(@Body() createAudioDto: CreateAudioDto): Promise<AudioLesson> {
        return this.audioLessonService.createAudioLesson(createAudioDto);
    }

    // // Lấy tất cả các Audio Lesson
    // @Get('getAll')
    // async findAll(): Promise<AudioLesson[]> {
    //     return this.audioLessonService.findAll();
    // }

    // // Lấy Audio Lesson theo ID
    // @Get(':id')
    // async getAudioById(@Param('id') id: number): Promise<AudioLesson> {
    //     return this.audioLessonService.getAudioById(id);
    // }
}