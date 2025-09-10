import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Section } from 'src/modules/section/entities/section.entity';
import { Topic } from 'src/modules/topic/entities/topic.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ['video', 'audio', 'translate'] })
  type: 'video' | 'audio' | 'translate';

  @Column()
  slug: string;

  @ManyToOne(() => Topic, topic => topic.lessons, { nullable: true })
  topic: Topic | null;

  @ManyToOne(() => Section, section => section.lessons, { nullable: true })
  section: Section | null;


}

