import { Section } from 'src/modules/section/entities/section.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {Lesson} from 'src/modules/lesson/entities/lesson.entity';

@Entity('topic')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column()
  level: string; // A1-C1

  @Column({ 
    type: 'enum', 
    enum: ['video', 'audio', 'translate'], // hoặc 'text' thay vì 'translate'
  })
  type: string; // Phân loại chủ đề

  @Column()
  slug: string; // Số lượng bài học trong chủ đề

  @Column({ default: 0 })
  totalLessons: number;

  @Column()
  title: string;

  @OneToMany(() => Section, (section) => section.topic, { cascade: true })
  sections: Section[];

  @OneToMany(() => Lesson, (lesson) => lesson.topic, { cascade: true })
  lessons: Lesson[];
}