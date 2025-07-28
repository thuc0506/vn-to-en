import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VideoLesson } from '../entities/video-lesson.entity';
import { VideoLessonService } from '../services/video-lesson.service';


@Controller('video-lesson')
export class VideoLessonController {
    constructor(private readonly lessionService: VideoLessonService) { }

    // Route để crawl tất cả các video từ playlist và lưu vào database
    @Post('crawl-from-playlist')
    async crawlVideosFromPlaylist(@Body('playlistUrl') playlistUrl: string): Promise<string> {
        try {
            // Gọi service để crawl video từ playlist
            await this.lessionService.crawlVideosFromPlaylist(playlistUrl);
            return `Đã hoàn thành việc crawl video từ playlist: ${playlistUrl}`;
        } catch (error) {
            console.error('Lỗi khi crawl playlist:', error);
            throw new Error('Không thể crawl video từ playlist');
        }
    }


    // ChallengeController
    @Get('/getVideo/:id')
    async getVideoById(@Param('id') id: number): Promise<VideoLesson> {
        return this.lessionService.getVideoById(id);
    }


    // Lấy tất cả các Challenge
    @Get('getAllVideo')
    async findAll(): Promise<VideoLesson[]> {
        return this.lessionService.findAll();
    }


       // Route để crawl 1 video cụ thể và lấy transcript
  @Post('crawl-single-video')
  async crawlSingleVideo(@Body('videoUrl') videoUrl: string): Promise<string> {
    try {
      const message = await this.lessionService.crawlSingleVideo(videoUrl);
      return message;
    } catch (error) {
      console.error('Lỗi khi crawl video:', error);
      throw new Error('Không thể crawl video từ URL cung cấp.');
    }
  }


}
