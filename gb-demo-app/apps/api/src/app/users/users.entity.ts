import { CommentsEntity } from '../news/comments/comments.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Timestamp,
} from 'typeorm';
import { NewsEntity } from '../news/news.entity';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../auth/role/role.enum';
import { ApiProperty } from '@nestjs/swagger';


@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        type: Number,
    })
    id: number;

    @Column('text')
    @ApiProperty({
        type: String,
        description: 'Имя пользователя',
        example: 'Alex'
    })
    firstName: string;

    @Column('text', { nullable: true })
    @ApiProperty({
        type: String,
        description: 'Аватар пользователя',
        example: 'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png'
    })
    avatar: string;

    @Column('text')
    @ApiProperty({
        type: String,
        description: 'email пользователя',
        example: 'example@mail.com'
    })
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    @IsEnum(Role)
    @ApiProperty({
        enum: ['Admin', 'Moderator', 'User'],
        description: 'Роль пользователя',
        default: 'User'
    })
    roles: Role;

    @OneToMany(() => NewsEntity, (news) => news.user)
    @ApiProperty({ type: () => NewsEntity })
    news: NewsEntity[];

    @OneToMany(() => CommentsEntity, (comments) => comments.user)
    @ApiProperty({ type: () => CommentsEntity })
    comments: CommentsEntity[];

    @CreateDateColumn({ type: 'timestamp' })
    @ApiProperty({ type: Timestamp })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    @ApiProperty({ type: Timestamp })
    updatedAt: Date;
}
