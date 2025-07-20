import { Module } from '@nestjs/common';
import { ContentTypesController } from './content_types.controller';
import { ContentTypesService } from './content_types.service';  
import { ContentTypes } from './entities/content_types.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [ TypeOrmModule.forFeature([ContentTypes]) ],
    controllers: [ContentTypesController],
    providers: [ContentTypesService],
})
export class ContentTypesModule {}






