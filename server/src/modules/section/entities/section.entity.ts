import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Topic } from 'src/modules/topic/entities/topic.entity';
import { Lesson } from 'src/modules/lesson/entities/lesson.entity';

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => Topic, (topic) => topic.sections)
  topic: Topic;


   @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.section)
  lessons: Lesson[];
}
