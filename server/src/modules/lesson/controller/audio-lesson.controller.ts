import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AudioLessonService } from '../services/audio-lesson.service';
import { CreateAudioDto } from '../dto/audio-lesson.dto';
import { multerOptions } from '../../config/multer.config';
import { Express } from 'express';

@Controller('audio-lesson')
export class AudioLessonController {
  constructor(private readonly audioLessonService: AudioLessonService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'audio', maxCount: 1 },
        { name: 'audio_transcript', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  async uploadAudioLesson(
    @UploadedFiles()
    files: {
      audio?: Express.Multer.File[];
      audio_transcript?: Express.Multer.File[];
    },
    @Body() body: CreateAudioDto,
  ) {
    const audioFile = files.audio?.[0];
    const transcriptFile = files.audio_transcript?.[0];

    const fileUrl = audioFile ? `/uploads/audio/${audioFile.filename}` : null;
    const fileTranscript = transcriptFile
      ? `/uploads/transcripts/audio/${transcriptFile.filename}`
      : null;

    return this.audioLessonService.createAudioLesson({
      ...body,
      url: fileUrl,
      transcript_path: fileTranscript,
    });
  }
}
