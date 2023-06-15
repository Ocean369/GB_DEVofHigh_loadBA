import {
  Controller, Get, Param, Post, Body, Delete, Res,
  UseInterceptors, UploadedFile, Render, HttpException,
  HttpStatus, ParseIntPipe, UseGuards, Req
} from '@nestjs/common';
import { NewsService,} from './news.service';
import { Response } from 'express'
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { HelperFileLoader } from '../../../utils/HelperFileLoader';
import { ApiBody, ApiTags, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { News } from './schemas/news.schemas';

const helperFileLoader = new HelperFileLoader();
const PATH_NEWS = '/news_static';
helperFileLoader.path = PATH_NEWS;

function isEmptyNews(news: EditNewsDto): Boolean {
  if (news['author'] === undefined && news['description'] === undefined && news['title'] === undefined) { return true; }
  return false
}

@ApiTags('news')
@ApiBearerAuth()
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService,
  ) { }


  @Get('api/all')
  async getAll(): Promise<News[]> {
    try {
      const news = await this.newsService.getAll();
      if(news === undefined) {
        return []
      }
      if(news instanceof Error) {
        throw Error('Произошла ошибка при получении данных')
      }
      return news
    } catch (error) {
      throw new Error(`Произошла ошибка при получении данных ${error}`)
    }
  }


  @Post('api')
  @ApiOperation({ summary: 'Create news' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover',
    {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: helperFileLoader.fileFilter
    }),
  )
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File
  ): Promise<News| Error> {
    try {
      if (cover?.filename) {
        news.cover = PATH_NEWS + '/' + cover.filename;
      }
      const newNews = await this.newsService.create(news);
      return newNews
    } catch (error) {
      return new Error(`err: ${error}`);
    }
  }

  //@UseGuards(JwtAuthGuard)
  @Delete('api/:id')
  async remove(@Param('id') id: string): Promise<string | Error> {
    try {
      const isRemoved = this.newsService.remove(id)
      return isRemoved ? 'Новость удалена!' : "Передан неверный идентификатор, удаление невозможно."
    } catch (error) {
      return new Error(`err: ${error}`);
    }

  }

  //@UseGuards(JwtAuthGuard)
  @Post('api/:id')
  @UseInterceptors(FileInterceptor('cover',
    {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: helperFileLoader.fileFilter
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() newsDto: EditNewsDto,
    @UploadedFile() cover: Express.Multer.File,
    @Res() response: Response): Promise<void> {
    try {
      if (cover?.filename) {
        newsDto.cover = PATH_NEWS + '/' + cover.filename;
      }

      const news = await this.newsService.findById(id)
      if (!news) {
        response.status(400).json({ message: 'Передан неверный идентификатор.Произвести изменения невозможно.' });
      }
      if (isEmptyNews(newsDto)) {
        response.status(400).json({ message: 'Не обнаруженно данных, в теле запроса.Произвести изменения невозможно.' });
      }
      //await this.mailService.sendEditNewsForAdmin(['ledix369@gmail.com'], newsDto, news)
      response.status(200).json({ message: this.newsService.update(id, newsDto) });

    } catch (error) {
      new Error(`err: ${error}`);
    }
  }

}


