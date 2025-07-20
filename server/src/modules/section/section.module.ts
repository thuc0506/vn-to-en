import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionService } from './section.service';
import { Section } from './entities/section.entity';
import { Topic } from '../topic/entities/topic.entity';
import { SectionController } from './section.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Section, Topic])],
  controllers:[SectionController],
  providers: [SectionService]
})
export class SectionModule {}
