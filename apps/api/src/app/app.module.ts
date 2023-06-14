import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
//import { MailModule } from './mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './news/comments/comments.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { NewsEntity } from './news/news.entity';
import { CommentsEntity } from './news/comments/comments.entity';
import { UsersEntity } from './users/users.entity';
//import { CacheModule } from './cache/cache.module';
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'xxx123123',
      database: 'news-blog',
      entities: [NewsEntity, CommentsEntity, UsersEntity],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'public'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../web'),
    }),
    NewsModule,
    //MailModule,
    UsersModule,
    CommentsModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
