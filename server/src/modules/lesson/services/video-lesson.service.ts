import { Injectable } from '@nestjs/common';
import * as ytdl from 'ytdl-core';
import * as ytpl from 'ytpl';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { exec } from 'child_process';
import { Repository } from 'typeorm';
import { VideoLesson } from '../entities/video-lesson.entity';
import { CreateLessionDto } from '../dto/video-lesson.dto';
import  {Section} from '../../section/entities/section.entity';
import { Lesson } from '../entities/lesson.entity';
import slugify from 'slugify';

@Injectable()
export class VideoLessonService {
    constructor(
        @InjectRepository(VideoLesson) private videoLessonRepository: Repository<VideoLesson>,
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>

    ) { }
    //crawl video 
    async crawlVideosFromPlaylist(playlistUrl: string): Promise<void> {
        try {
            const playlist = await ytpl(playlistUrl);
            console.log(`Found ${playlist.items.length} videos in playlist`);

            const crawlPromises = playlist.items.map(async (item) => {
                try {
                    const videoExists = await this.videoLessonRepository.findOne({
                        where: { url: item.url }
                    });

                    if (videoExists) {
                        console.log(`Video ${item.title} already exists, skipping...`);
                        return;
                    }

                    let videoDetails;
                    try {
                        videoDetails = await ytdl.getBasicInfo(item.url);
                    } catch (infoError) {
                        if (
                            infoError.message.includes('Private video') ||
                            infoError.message.includes('Sign in if you\'ve been granted access') ||
                            infoError.message.includes('Video unavailable')
                        ) {
                            console.log(`Skipping private/unavailable video: ${item.title}`);
                            return;
                        }
                        throw infoError;
                    }
                     const slug = slugify(videoDetails.videoDetails.title, { lower: true });

                    // Tạo lesson
                    const lesson = await this.lessonRepository.save({
                        title: videoDetails.videoDetails.title,
                         slug: slug,
                        type: 'video',
                        section: null
                    });

                   

                    // Tạo video lesson
                    const video = await this.videoLessonRepository.save({
                        lesson,
                        title: videoDetails.videoDetails.title,
                        url: videoDetails.videoDetails.video_url,
                        thumbnail: videoDetails.videoDetails.thumbnails[0]?.url || '',
                        description: videoDetails.videoDetails.description,
                       
                    });

                    // Crawl transcript
                    try {
                        await this.getTranscriptFromVideo(video.url, video.title, video.id, lesson.id);
                    } catch (transcriptError) {
                        // Nếu transcript lỗi, đã xử lý xoá trong hàm bên dưới
                        console.error(`Transcript error: ${transcriptError}`);
                    }

                } catch (error) {
                    console.error(`Error processing video ${item.url}:`, error);
                }
            });

            await Promise.all(crawlPromises);
            console.log('Finished processing all videos');

        } catch (error) {
            console.error('Error crawling playlist:', error);
            throw error;
        }
    }


    //crawl transciprt video
    async getTranscriptFromVideo(videoUrl: string, videoTitle: string, videoId: number, lessonId: number): Promise<void> {
        return new Promise((resolve, reject) => {
           const outputDir = path.resolve('tmp/transcripts');


        const ffmpegPath = path.resolve('public/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe');



            const safeTitle = videoTitle.replace(/[\/:*?"<>|]/g, '').replace(/\s+/g, '_');
            const transcriptFileName = `${safeTitle}_${videoId}.en.vtt`;
            const outputPath = path.join(outputDir, `${safeTitle}_${videoId}`);
            // Gắn ffmpeg vào môi trường tạm thời của command
            const command = `yt-dlp --ffmpeg-location "${ffmpegPath}" --write-auto-sub --skip-download --sub-lang en --output "${outputPath}" "${videoUrl}"`;


            exec(command, async (error, stdout, stderr) => {
                if (error) {
                    // Kiểm tra lỗi liên quan đến subtitle
                    if (
                        stderr.includes('No subtitles') ||
                        stderr.includes('There are no subtitles for the requested languages')
                    ) {
                        // Thay vì chỉ reject, xóa luôn video khỏi database
                        try {
                            await this.videoLessonRepository.delete(videoId);
                            console.log(`Deleted video ${videoTitle} due to no subtitles`);
                            return reject('No subtitles available for this video');
                        } catch (deleteError) {
                            console.error(`Error deleting video ${videoTitle}:`, deleteError);
                            return reject('Could not delete video without subtitles');
                        }
                    }

                    console.error('Error executing yt-dlp:', error);
                    console.error('Details:', stderr);
                    return reject('Không thể tải transcript từ video');
                }

                // Kiểm tra xem file transcript có tồn tại không
                const transcriptPath = path.join(outputDir, `${safeTitle}_${videoId}.en.vtt`);
                if (!fs.existsSync(transcriptPath)) {
                    // Nếu không có file transcript, xóa video
                    try {
                        await this.videoLessonRepository.delete(videoId);
                        await this.lessonRepository.delete(lessonId);
                        return reject('Transcript file was not created');
                    } catch (deleteError) {
                        console.error(`Error deleting video ${videoTitle}:`, deleteError);
                        return reject('Could not delete video without transcript');
                    }
                }

                // Cập nhật tên file transcript trong bảng videos
                const video = await this.videoLessonRepository.findOne({ where: { id: videoId } });
                if (video) {
                    video.transcript_path = transcriptFileName;
                    await this.videoLessonRepository.save(video);
                    console.log('Transcript file name saved successfully in videos table');
                    resolve();
                } else {
                    reject('Video không tồn tại trong cơ sở dữ liệu');
                }
            });
        });
    }


    // Hàm để lấy thông tin video theo ID
    async getVideoById(videoId: number): Promise<VideoLesson> {
        return this.videoLessonRepository.findOne({
            where: { id: videoId },

        });
    }


    async crawlSingleVideo(videoUrl: string): Promise<string> {
        try {
            // Kiểm tra xem video đã tồn tại chưa
            const videoExists = await this.videoLessonRepository.findOne({ where: { url: videoUrl } });
            if (videoExists) {
                return `Video "${videoExists.title}" đã tồn tại, không cần crawl lại.`;
            }

            // Lấy thông tin chi tiết từ video
            const videoDetails = await ytdl.getBasicInfo(videoUrl);
            const slug = slugify(videoDetails.videoDetails.title, {
                lower: true,
                locale: 'vi', // dùng locale tiếng Việt
                remove: /[*+~.()'"!:@?^%#`$&=<>[\]{}]/g, // loại bỏ ký tự đặc biệt });
            })
            // Tạo đối tượng video
            const videoData: CreateLessionDto = {
                title: videoDetails.videoDetails.title,
                url: videoDetails.videoDetails.video_url,
                thumbnail: videoDetails.videoDetails.thumbnails[0].url,
                description: videoDetails.videoDetails.description,
                slug: slug,
            };

            // Lưu thông tin video vào cơ sở dữ liệu
            const video = await this.videoLessonRepository.save(videoData);
            console.log(`Đã lưu video: ${videoData.title}`);

            // Tải transcript và cập nhật vào cơ sở dữ liệu
            try {
                await this.getTranscriptFromVideo(video.url, video.title, video.id, video.lesson.id);
            } catch (transcriptError) {
                console.error(`Lỗi khi tải transcript cho video ${videoData.title}: ${transcriptError}`);

                // Xóa video vừa lưu nếu không tải được transcript
                await this.videoLessonRepository.remove(video);

                // Trả về thông báo lỗi
                return `Không thể tải transcript cho video "${videoData.title}", video đã bị xóa.`;
            }

            return `Đã crawl và lưu thành công video: ${videoData.title}`;
        } catch (error) {
            console.error('Lỗi khi crawl video:', error);
            throw new Error('Không thể crawl video từ URL cung cấp.');
        }
    }


    // Lấy tất cả các video
    async findAll(): Promise<VideoLesson[]> {
        return this.videoLessonRepository.find();
    }






}













