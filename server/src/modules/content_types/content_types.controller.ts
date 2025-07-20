// content_types.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContentDTO } from './dto/content_types.dto';
import { ContentTypes } from './entities/content_types.entity';
import { ContentTypesService } from './content_types.service';

@Controller('content-types')
export class ContentTypesController {
    constructor(private readonly contentService: ContentTypesService) { }

    @Post('create')
    // Gọi service để tạo một content type mới
    async createContentType(@Body() content: ContentDTO): Promise<ContentTypes> {
        
        return this.contentService.createContentType(content);
    }

    @Get('all')
    async getAllContentTypes(): Promise<ContentTypes[]> {
        return this.contentService.getAllContentTypes();
    }
}