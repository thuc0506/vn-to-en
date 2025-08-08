import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from 'src/modules/lesson/entities/lesson.entity';

@Entity()
export class AudioLesson {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Lesson, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  lesson: Lesson;

  @Column()
  title: string;

  // Đường dẫn hoặc URL file audio (mp3, wav, v.v.)
  @Column()
  url: string;

  // File transcript đi kèm (dạng text hoặc JSON)
  @Column({ type: 'text', nullable: true })
  transcript_path: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
