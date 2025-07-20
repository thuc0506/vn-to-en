import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from 'typeorm';


@Entity('content_types') // Đặt tên bảng là "comments"
export class ContentTypes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string; // Tên loại nội dung

    @Column({ type: 'text' })
    displayName: string; // Tên hiển thị của loại nội dung
}


