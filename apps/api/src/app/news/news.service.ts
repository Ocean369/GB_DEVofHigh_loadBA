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
  ) {}

  private cacheKey = 'news';

  private async getCache(key: string): Promise<void>{
     // Проверяем, есть ли данные в кэше
    const _existsCache = await this.cacheService.existsCache(key);
    if(!_existsCache){
      const _news = await this.newsModel.find().exec();
      let strArrNews: string[] = [];
      _news.forEach(val => {
           strArrNews.push(JSON.stringify(val));
      })
      await this.cacheService.createCache(key,strArrNews,3600);
    }
  }


  async create(news: CreateNewsDto): Promise<News> {
    const _news = new News;
    _news.author = news.author;
    _news.title = news.title;
    _news.description = news.description
    _news.cover = news.cover;
    _news.createdAt = new Date();
    _news.updatedAt = _news.createdAt;

    const createdNews = await (await this.newsModel.create(_news));
    //console.log('created news', await this.findById(createdNews._id.toString()));
// Добавляем новость в кэш
    await this.getCache(this.cacheKey);
    await this.cacheService.addToCache(
      this.cacheKey,
      JSON.stringify(
        await this.findById(createdNews._id.toString())
      )); // Например, кэш на 1 час

    return createdNews
  }

  async findById(id: string): Promise<News| null> {
    return this.newsModel.findOne({ _id: id  }).exec();
    //return await this.newsRepository.findOneBy({ id })
  }

  async getAll(): Promise<any> {
    try {
      await this.getCache(this.cacheKey);
      // Проверяем, есть ли данные в кэше

      const _newsCache = await this.cacheService.getFromCache(this.cacheKey);
      //console.log('Вот данные from cache => ...', _newsCache);
      let _newsFromCache = []
        _newsCache.forEach(val=> {
          _newsFromCache.push(JSON.parse(val));
        })
        return _newsFromCache
    } catch (error) {
      throw Error(`Произошла ошибка: ${error}`)
    }
  }

  async remove(id:string): Promise<string> {
    try {
      await this.getCache(this.cacheKey);
      const removingNews = await this.findById(id);
      if (removingNews) {
        const deletedCat = await this.newsModel.findByIdAndRemove({_id: id }).exec();
            // Удаляем данные из кэша
        await this.cacheService.removeFromCache(this.cacheKey,JSON.stringify(removingNews));
        return `Новость id:${id} <<${removingNews.title}>> удалена!`
      }
        return `Новость id:${id} <<${removingNews.title}>> не найдена!`
    } catch (error) {
      throw Error(`Произошла ошибка: ${error}`)
    }
  }

  async update(id: string, news: EditNewsDto | undefined): Promise<string> {
    try {
      await this.getCache(this.cacheKey);
      let findNews = await this.findById(id);
      if (findNews) {
        const _news = new News();
        _news.title = news.title || findNews.title;
        _news.description = news.description || findNews.description;
        _news.cover = news.cover || findNews.cover;
        _news.author = findNews.author;
        _news.createdAt = findNews.createdAt;
        _news.updatedAt = new Date();
        await this.newsModel.findOneAndUpdate({_id: id }, _news, { new: true }).exec();
        //console.log('_upd news',await _upd.save());
        //Обновляем данные в кэше
        await this.cacheService.updateCache(
          this.cacheKey,
          JSON.stringify(findNews),
          JSON.stringify(
            await this.findById(id)
            ));
        return 'Новость успешна изменена!'
      }
      return 'Новость не найдена'

    } catch (error) {
      throw Error(`Произошла ошибка: ${error}`);
    }
  }

}

