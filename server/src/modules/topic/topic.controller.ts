import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicDTO } from './dto/topic.dto';
import { Topic } from './entities/topic.entity';

@Controller('topic')
export class TopicController {
    constructor(private readonly topicService: TopicService) { }


    //Tạo Topic
    @Post('create')
    async create(@Body() createTopicDTO: TopicDTO): Promise<Topic> {
        return this.topicService.createTopic(createTopicDTO);
    }

    //lấy danh sách topic
    @Get('getAll')
    async getListTopic(): Promise<Topic[]> {
        return this.topicService.getListTopic();
    }

    @Get('getByType/:type')
    async getTopicByType(@Param('type') type: string): Promise<Topic[]> {
        return this.topicService.getTopicByType(type);
    }

    @Get('getBySlugAndType/:slug')
    async getTopicBySlugAndType(
        @Param('slug') slug: string,
        @Query('type') type: string,
    ): Promise<Topic> {
        return this.topicService.getTopicBySlugAndType(slug, type);
    }





}
