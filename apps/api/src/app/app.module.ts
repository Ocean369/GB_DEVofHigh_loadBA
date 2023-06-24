import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
//import { MailModule } from './mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { UsersModule } from './users/users.module';
//import { CommentsModule } from './news/comments/comments.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
//import { AuthModule } from './auth/auth.module';
//import { NewsEntity } from './news/news.entity';
//import { CommentsEntity } from './news/comments/comments.entity';
//import { UsersEntity } from './users/users.entity';
//import { CacheModule } from './cache/cache.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/news_blog'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'public'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../web'),
    }),
    NewsModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
   // ChatGateway,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
