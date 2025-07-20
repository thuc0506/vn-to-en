import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { TopicDTO } from './dto/topic.dto';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic) private topicRespository: Repository<Topic>,
    ){}
    //Tạo TOPIC
    async createTopic(topicDTO: TopicDTO): Promise<Topic>{
        const topic = this.topicRespository.create(topicDTO);
        return this.topicRespository.save(topic);
    }

    //Lấy danh sách TOPIC
    async getListTopic(): Promise<Topic[]>{
        return this.topicRespository.find();
    }
       
}


