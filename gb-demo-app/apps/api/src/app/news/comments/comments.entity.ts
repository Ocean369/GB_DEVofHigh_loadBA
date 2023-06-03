import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity';
import { NewsEntity } from '../news.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity('comments')
export class CommentsEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column('text')
    @ApiProperty({
        type: String,
        description: 'Текст комментария',
        example: 'A good news!'
    })
    message: string;

    @ManyToOne(() => UsersEntity, (user) => user.comments, { eager: true })
    @ApiProperty({ type: () => UsersEntity })
    user: UsersEntity;

    @CreateDateColumn({ type: 'timestamp' })
    @ApiProperty()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    @ApiProperty()
    updatedAt: Date;

    @ManyToOne(() => NewsEntity, (news) => news.comments, { eager: true })
    @ApiProperty({ type: () => NewsEntity })
    news: NewsEntity;
}