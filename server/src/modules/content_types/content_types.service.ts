import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentDTO } from './dto/content_types.dto';
import { ContentTypes } from './entities/content_types.entity';

@Injectable()
export class ContentTypesService {
    constructor(
        @InjectRepository(ContentTypes)
        private readonly contentTypeRepository: Repository<ContentTypes>,
    ){}


    //create a new content type
    async createContentType(content: ContentDTO): Promise<ContentTypes> {
        const contentType = this.contentTypeRepository.create(content);
        return this.contentTypeRepository.save(contentType);
    }

    //get all content types
    async getAllContentTypes(): Promise<ContentTypes[]> {   
        return this.contentTypeRepository.find();
    }


}
