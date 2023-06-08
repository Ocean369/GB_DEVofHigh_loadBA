import { Injectable, Inject } from '@nestjs/common';
import { CachingConfig, caching, Cache, Store } from 'cache-manager';
import { NewsEntity } from '../news/news.entity';
import { NewsDto } from '../news/news.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  //private cacheManager: Cache<Store>;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.initializeCacheManager();
  }

  private async initializeCacheManager() {
    this.cacheManager = await caching('memory', {
      max: 100,
      ttl: 10 * 1000 /*milliseconds*/,
    });
  }

  async createCache(key: string, value: NewsEntity[], ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async addToCache(key: string, value: NewsEntity, ttl: number): Promise<void> {
    try {
      // Получение текущего состояния кеша
      const currentNews = await this.cacheManager.get('news') as Array<NewsEntity>;

      // Добавление новой новости
      currentNews.push(value);

      // Обновление кеша с обновленными данными
      await this.cacheManager.set('news', currentNews);

      console.log('Новость успешно добавлена в кеш');
    } catch (error) {
      console.error('Ошибка при добавлении новости в кеш:', error);
    }
    // await this.cacheManager.set(key, value, ttl);
  }

  async updateCache(key: string, value: any, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async getFromCache(key: string): Promise<any> {
    const _cache = await this.cacheManager.get(key);
    return _cache
  }

  async removeFromCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
