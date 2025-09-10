import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Lesson } from 'src/modules/lesson/entities/lesson.entity';

@Entity()
export class TranslateLesson {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Lesson, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    lesson: Lesson;


    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    level: string;

    @Column()
    number_of_question: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
