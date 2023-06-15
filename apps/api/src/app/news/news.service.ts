import { Injectable} from '@nestjs/common';
import { CreateNewsDto } from './dtos/create-news-dto';
import { CacheService } from '../cache/cache.service';
import { Model } from 'mongoose';
import { News, NewsSchema } from './schemas/news.schemas'
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { EditNewsDto } from './dtos/edit-news-dto';


@Injectable()
export class NewsService {
  constructor(
    private cacheService: CacheService,
    @InjectModel('News') private readonly newsModel: Model<News>
  ) { }

  async create(news: CreateNewsDto): Promise<News> {
    const _news = new News;
    _news.author = news.author;
    _news.title = news.title;
    _news.description = news.description
    _news.cover = news.cover;
    _news.createdAt = new Date();
    _news.updatedAt = _news.createdAt;
    // // Проверяем, есть ли данные в кэше
    // const cachedNews = await this.cacheService.getFromCache('news');
    // if (!cachedNews) {
    //   console.log('Кэш пуст - заполним')
    //   const _newsAll = await this.newsModel.find().exec();
    //   //Сохраняем полученные новости в кэше
    //   await this.cacheService.createCache('news', _newsAll, 3600000); // Например, кэш на 1 час
    // }
    // const cacheKey = 'news';
    const createdNews = await this.newsModel.create(_news);
    // console.log('createdNews',createdNews);
    // // Добавляем новость в кэш
    // await this.cacheService.addToCache(cacheKey, createdNews , 3600000); // Например, кэш на 1 час

    return createdNews.save()
  }

  async findById(id: string): Promise<News| null> {
    return this.newsModel.findOne({ _id: id  }).exec();
    //return await this.newsRepository.findOneBy({ id })
  }

  async getAll(): Promise<News[] | undefined| Error> {
    try {
    // const cacheKey = 'news';
    // // Проверяем, есть ли данные в кэше
    // const cachedNews: News[] = await this.cacheService.getFromCache(cacheKey);

    // if (cachedNews) {
    //   console.log('cachedNews', cachedNews.length);
    //   console.log('данные есть')
    //   // Возвращаем данные из кэша
    //   return cachedNews;
    // } else {
      const _news = await this.newsModel.find().exec();
      // //Сохраняем полученные новости в кэше
      // await this.cacheService.createCache(cacheKey, _news, 360000); // Например, кэш на 1 час
      // console.log('заполнили кэш');
      // // Возвращаем новости
      return _news;

  } catch (error) {
    return new Error(`Произошла ошибка: ${error}`)
  }
  }

  async remove(id:string): Promise<boolean | Error> {
    try {
      // // Проверяем, есть ли данные в кэше
      // const cachedNews = await this.cacheService.getFromCache('news');

      // if (!cachedNews) {
      //   const _news = await this.newsModel.find().exec();
      //   //Сохраняем полученные новости в кэше
      //   await this.cacheService.createCache('news', _news, 360000); // Например, кэш на 1 час
      // }

      const removingNews = await this.findById(id);
      if (removingNews) {
          const deletedCat = await this.newsModel.findByIdAndRemove({_id: id }).exec();
          // const cacheKey = `news:${id}`;
          // // Удаляем данные из кэша
          // await this.cacheService.removeFromCache(cacheKey);
          return true
        //}
      }
      return false
    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`)
    }
  }

  async update(id: string, news: EditNewsDto | undefined): Promise<string | Error | null> {
    try {
      // Проверяем, есть ли данные в кэше
      // const cachedNews = await this.cacheService.getFromCache('news');

      // if (!cachedNews) {
      //   const _newsAll = await this.newsModel.find().exec();
      //   //Сохраняем полученные новости в кэше
      //   const _cache = await this.cacheService.createCache('news', _newsAll, 3600000); // Например, кэш на 1 час
      // }


      let findNews = await this.findById(id);
      if (findNews) {
        const _news = new News();
        _news.title = news.title || findNews.title;
        _news.description = news.description || findNews.description;
        _news.cover = news.cover || findNews.cover;
        _news.author = findNews.author;
        _news.createdAt = findNews.createdAt;
        _news.updatedAt = new Date();
        const _upd = await this.newsModel.findOneAndUpdate({_id: id }, _news, { new: true }).exec();
        //_upd.save();
        // Обновляем данные в кэше
        ///const cacheKey = `news:${id}`;
        //await this.cacheService.updateCache(cacheKey, _upd, 3600000);

        return 'Новость успешна изменена!'
      }
      return 'Новость не найдена'

    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`);
    }
  }

}

