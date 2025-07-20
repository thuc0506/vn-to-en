import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicDTO } from './dto/topic.dto';
import { Topic } from './entities/topic.entity';

@Controller('topic')
export class TopicController {
    constructor(private readonly topicService: TopicService){}


    //Tạo Topic
    @Post('create')
    async create(@Body() createTopicDTO: TopicDTO): Promise<Topic>{
        return this.topicService.createTopic(createTopicDTO);
    }

    //lấy danh sách topic
    @Get('getAll')
    async getListTopic(): Promise<Topic[]>{
        return this.topicService.getListTopic();
    }
    

}
