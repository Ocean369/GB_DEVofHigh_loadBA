import {  Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CacheModule } from '../cache/cache.module';
import { NewsSchema, News } from './schemas/news.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [NewsController],
  providers: [
    NewsService,
  ],
  imports: [
    CacheModule,
    MongooseModule.forFeature([{ name: 'News', schema: NewsSchema }]),
  ],
  exports: [
    NewsService,
  ],
})
export class NewsModule { }
