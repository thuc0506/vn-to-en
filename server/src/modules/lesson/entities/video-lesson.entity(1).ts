import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Lesson } from 'src/modules/lesson/entities/lesson.entity';

@Entity()
export class VideoLesson {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Lesson, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  lesson: Lesson;


  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ type: 'text', nullable: true })
  transcript_path: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
