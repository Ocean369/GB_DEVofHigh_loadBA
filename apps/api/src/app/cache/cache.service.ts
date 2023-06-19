import { Injectable, Inject } from '@nestjs/common';
import { CachingConfig, caching, Cache, Store } from 'cache-manager';
import Redis from 'ioredis';
const redis = new Redis();
//import { NewsEntity } from '../news/news.entity';
// import { NewsDto } from '../news/news.service';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { News, NewsSchema } from '../news/schemas/news.schemas'

@Injectable()
export class CacheService {
  //private cacheManager: Cache<Store>;
  private redis: Redis;
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.redis = new Redis(6379);
  }

  async existsCache (key: string): Promise<boolean> {
    const exist = await this.redis.exists(key);
    if(exist === 1){
      return true
    }
    return false
  }

  async createCache(key: string, value: string[], ttl?: number): Promise<void> {
    try {
      await this.redis.rpush(key,...value);
      await this.redis.expire(key, ttl);
      console.log('Заполнили кэш данными из БД ');
    } catch (error) {
      throw Error(`SET. Something went wrong: ${error}`)
    }

  }

  async addToCache(key: string, value: string): Promise<void> {
    try {
      console.log('adding news', value);
      await this.redis.rpush(key,value);
      console.log('Добавили запись в кэш');
    } catch (error) {
        throw Error(`APPEND. Something went wrong: ${error}`);
      }
  }

  async updateCache(key: string, value_old: string, value_upd: string): Promise<void> {
    try {
      let indexUpdate:number = await this.redis.lpos(key,value_old);
      //const _cache = await this.redis.lrange(key,0,-1);
      // console.log('Cache get =>',_cache);
      console.log('find item => ',value_old);
      // // _cache.forEach((val,i)=> {
      // //   if (val === value_old){
      // //     indexUpdate = i;
       console.log('find index = ',indexUpdate);

      // //   }
      // // });
      await this.redis.lset(key,indexUpdate,value_upd);
      console.log('Изменили запись в кэш');
    } catch (error) {
      throw Error(`UPDATE. Something went wrong: ${error}`);
    }
  }

  async getFromCache(key: string): Promise<string[]> {
    try {
      console.log('**** GET DATE from ',key, ' *****');
      const _cache = await this.redis.lrange(key,0,-1);
      console.log('Что лежит в кэш? => ', _cache);
      return _cache
    } catch (error) {
      throw Error(`GET. Something went wrong: ${error}`);
    }
  }

  async removeFromCache(key: string,value:string): Promise<void> {
    try {
      //const _cache = await this.redis.lrange(key,0,-1);
      await this.redis.lrem(key,0,value);
      console.log('Новость успешно удалена из кэш')
    } catch (error) {
        throw Error(`REMOVE. Something went wrong: ${error}`);
      }
  }

  async clearCache(key:string): Promise<void> {
    console.log(`****** del key=${key} from redis *******`);
      await this.redis.del(key);
  }


  async TopTenAuthor(key:string,news: News[]):Promise<any> {
    console.log('******* TOP 10 **********');
    const IsIt = await this.redis.exists(key);
    if(IsIt === 1){
      await this.redis.zremrangebyrank(key,0,-1);
    }
    news.forEach(async (val) => {
      console.log('news => ',val);
      console.log(await this.redis.zincrby(key,1,val.author));
    })
    return await this.redis.zrevrange(key,0,9,'WITHSCORES');
  }
}
