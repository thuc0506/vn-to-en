// src/modules/roles/entities/role.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity,
} from 'typeorm';
import { User } from '../entities/user.entity'; // Import User entity để liên kết với Role

@Entity('roles')
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string; // e.g., 'admin', 'user'

    // One-to-Many relation with User
    @OneToMany(() => User, (user) => user.role) // Thay đổi 'users' thành 'role'
    users: User[];
}
