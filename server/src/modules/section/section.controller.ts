import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionDTO } from './dto/section.dto';
import { Section } from './entities/section.entity';

@Controller('section')
export class SectionController {
    constructor(private readonly sectionService: SectionService) {}

    // Tạo section
    @Post('create')
    async create(@Body() createSectionDTO: SectionDTO): Promise<Section> {
        return this.sectionService.createSection(createSectionDTO);
    }

    // Lấy tất cả sections
    @Get()
    async findAll(): Promise<Section[]> {
        return this.sectionService.findAll();
    }

    // Lấy section theo id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Section> {
        return this.sectionService.findOne(id);
    }

    // Lấy sections theo topicId
    @Get('by-topic/:topicId')
    async findByTopicId(@Param('topicId', ParseIntPipe) topicId: number): Promise<Section[]> {
        return this.sectionService.findByTopicId(topicId);
    }

    // Cập nhật section
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSectionDTO: SectionDTO,
    ): Promise<Section> {
        return this.sectionService.update(id, updateSectionDTO);
    }

    // Xóa section
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.sectionService.remove(id);
    }


   
 
}