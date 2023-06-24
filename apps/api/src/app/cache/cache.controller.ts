import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {

  constructor(private readonly cacheService: CacheService){
  }
  cacheKey = 'chat_list'

  @Get('')
  async getAllChats():Promise<string[]>{
    try {
      return await this.cacheService.getFromCache(this.cacheKey);
    } catch (error) {
      throw new Error(`Произошла ошибка при получении данных ${error}`)
    }
  }

  @Post('')
  async addChat(@Body() body){
    await this.cacheService.addToCache(this.cacheKey,body.name);
  }

  @Delete('/:name')
  async removeChat(@Param('name') name: string){
    await this.cacheService.removeFromCache(this.cacheKey,name);
  }


}
