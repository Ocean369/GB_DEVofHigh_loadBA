// import { UsersEntity } from '../users/users.entity';
// import {
//     Column,
//     Entity,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     ManyToOne,
//     OneToMany,
// } from 'typeorm';
// import { CommentsEntity } from './comments/comments.entity';
// import { ApiProperty } from '@nestjs/swagger';


// @Entity('news')
// export class NewsEntity {
//     @PrimaryGeneratedColumn()
//     @ApiProperty()
//     id: number;

//     @Column('text')
//     @ApiProperty({
//         type: String,
//         description: 'Заголовок статьи',
//         example: 'News Title'
//     })
//     title: string;

//     @Column('text')
//     @ApiProperty({
//         type: String,
//         description: 'Текс статьи',
//         example: 'Once upon a time...'
//     })
//     description: string;

//     @Column('text', { nullable: true })
//     @ApiProperty({
//         type: String,
//         description: 'Обложка новости',
//         example: 'https://img.freepik.com/premium-photo/3d-illustration-globe-word-news-black-background-business-international-media-concept_556904-736.jpg?w=2000'
//     })
//     cover: string;

//     @ManyToOne(() => UsersEntity, (user) => user.news, { eager: true })
//     @ApiProperty({ type: () => UsersEntity })
//     user: UsersEntity;

//     @CreateDateColumn({ type: 'timestamp' })
//     @ApiProperty()
//     createdAt: Date;

//     @UpdateDateColumn({ type: 'timestamp' })
//     @ApiProperty()
//     updatedAt: Date;

//     @OneToMany(() => CommentsEntity, (comments) => comments.news)
//     @ApiProperty({ type: () => CommentsEntity })
//     comments: CommentsEntity[]
// }


