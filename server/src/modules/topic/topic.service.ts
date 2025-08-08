import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { TopicDTO } from './dto/topic.dto';
import slugify from 'slugify';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic) private topicRespository: Repository<Topic>,
    ) { }
    //Tạo TOPIC
    async createTopic(topicDTO: TopicDTO): Promise<Topic> {
        const slug = slugify(topicDTO.title, {
            lower: true,
            locale: 'vi', // dùng locale tiếng Việt
            remove: /[*+~.()'"!:@?^%#`$&=<>[\]{}]/g, // loại bỏ ký tự đặc biệt
        });
        const topic = this.topicRespository.create({ ...topicDTO, slug });
        return this.topicRespository.save(topic);
    }

    //Lấy danh sách TOPIC
    async getListTopic(): Promise<Topic[]> {
        return this.topicRespository.find();
    }

    //Lấy TOPIC theo type
    async getTopicByType(type: string): Promise<Topic[]> {
        return this.topicRespository.find({
            where: { type },
        });
    }

    //Lấy TOPIC và section theo Slug
    async getTopicBySlugAndType(slug: string, type: string): Promise<Topic> {
        return this.topicRespository.findOne({
            where: { slug, type },
            relations: ['sections', 'sections.lessons'],
        });
    }

}


