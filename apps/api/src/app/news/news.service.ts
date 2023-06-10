import { Injectable, forwardRef, Inject } from '@nestjs/common';
// import { Comment } from './comments/comments.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { CreateNewsDto } from './dtos/create-news-dto';
import { UsersService } from '../users/users.service';
import { CommentsService } from './comments/comments.service';
import { CacheService } from '../cache/cache.service';

import { Cache } from 'cache-manager';

export interface News {
  id?: number;
  title: string;
  description: string;
  // author: string;
  // countView?: number;
  comments?: Comment[];
  cover?: string;
}

export interface NewsDto {
  title?: string;
  description?: string;
  cover?: string
  // author?: string;
}

export function getRandomInt(min: number = 1, max: number = 99999): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
    private userService: UsersService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
    private cacheService: CacheService,
    //@Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(news: CreateNewsDto): Promise<NewsEntity> {
    const newsEntity = new NewsEntity();
    newsEntity.title = news.title;
    newsEntity.description = news.description;
    newsEntity.cover = news.cover;
    let _user = await this.userService.findById(parseInt(news.userId));
    _user.password = '******';
    newsEntity.user = _user;
    // Проверяем, есть ли данные в кэше
    const cachedNews = await this.cacheService.getFromCache('news');

    if (!cachedNews) {
      console.log('Кэш пуст - заполним')
      const _news = await this.newsRepository.find();
      //Сохраняем полученные новости в кэше
      await this.cacheService.createCache('news', _news, 3600); // Например, кэш на 1 час
    }

    const cacheKey = 'news';
    const _news = await this.newsRepository.save(newsEntity)
    // Добавляем новость в кэш
    await this.cacheService.addToCache(cacheKey, _news, 3600); // Например, кэш на 1 час

    return _news
  }

  async findById(id: News['id']): Promise<NewsEntity | null> {

    return await this.newsRepository.findOneBy({ id })
  }

  async getAll(): Promise<NewsEntity[] | undefined> {

    const cacheKey = 'news';
    // Проверяем, есть ли данные в кэше
    const cachedNews = await this.cacheService.getFromCache(cacheKey);

    if (cachedNews) {
      // Возвращаем данные из кэша
      return cachedNews;
    }
    // Если данных нет в кэше, выполняем логику получения новостей
    const _news = await this.newsRepository.find();
    //Сохраняем полученные новости в кэше
    await this.cacheService.createCache(cacheKey, _news, 3600); // Например, кэш на 1 час

    // Возвращаем новости
    return _news;
  }

  async sortAllByUserId(idUser: number): Promise<NewsEntity[] | undefined> {
    return await this.newsRepository.find({
      relations: ["comments", "user"],
      where: { user: { id: idUser } },
    });
  }

  async remove(id: News['id']): Promise<boolean | Error> {
    try {
      // Проверяем, есть ли данные в кэше
      const cachedNews = await this.cacheService.getFromCache('news');

      if (!cachedNews) {
        const _news = await this.newsRepository.find();
        //Сохраняем полученные новости в кэше
        await this.cacheService.createCache('news', _news, 3600); // Например, кэш на 1 час
      }

      const removingNews = await this.findById(id);
      if (removingNews) {
        const comments = await this.commentsService.findAll(id);
        if (!(comments instanceof Error)) {
          await this.commentsService.removeAllForIdNews(comments);
          await this.newsRepository.delete(id);
          const cacheKey = `news:${id}`;
          // Удаляем данные из кэша
          await this.cacheService.removeFromCache(cacheKey);
          return true
        }
      }
      return false
    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`)
    }
  }

  async update(id: News['id'], news: NewsDto | undefined): Promise<string | Error | null> {

    try {
      // Проверяем, есть ли данные в кэше
      const cachedNews = await this.cacheService.getFromCache('news');

      if (!cachedNews) {
        const _news = await this.newsRepository.find();
        //Сохраняем полученные новости в кэше
        await this.cacheService.createCache('news', _news, 3600); // Например, кэш на 1 час
      }

      let findNews = await this.findById(id);
      if (findNews) {
        const newsEntity = new NewsEntity();
        newsEntity.title = news.title || findNews.title;
        newsEntity.description = news.description || findNews.description;
        newsEntity.cover = news.cover || findNews.cover;
        const _newsUpdated = await this.newsRepository.update(id, newsEntity)
        const cacheKey = `news:${id}`;
        // Обновляем данные в кэше
        await this.cacheService.updateCache(cacheKey, _newsUpdated, 3600);
        return 'Новость успешна изменена!'
      }
      return null

    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`);
    }
  }

}

