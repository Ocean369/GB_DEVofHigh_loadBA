import {
  Controller, Get, Param, Post, Body, Delete, Res,
  UseInterceptors, UploadedFile, Render, HttpException,
  HttpStatus, ParseIntPipe, UseGuards, Req
} from '@nestjs/common';
import { NewsService, News, NewsDto } from './news.service';
import { Response } from 'express'
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { HelperFileLoader } from '../../../utils/HelperFileLoader';
//import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { ApiBody, ApiTags, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { getCookie } from '../../../utils/cookie';

const helperFileLoader = new HelperFileLoader();
const PATH_NEWS = '/news_static';
helperFileLoader.path = PATH_NEWS;

function isEmptyNews(news: NewsDto): Boolean {
  if (news['author'] === undefined && news['description'] === undefined && news['title'] === undefined) { return true; }
  return false
}

@ApiTags('news')
@ApiBearerAuth()
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    //private readonly mailService: MailService,
  ) { }


  @Get('api/all')
  @ApiOperation({ summary: 'Получить все новости' })
  @ApiResponse({ status: 200, description: 'All News', type: [NewsEntity] })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAll(): Promise<NewsEntity[]> {
    try {
      const news = await this.newsService.getAll();
      return news
    } catch (error) {
      throw new Error(error)
    }
  }

  @Get('/all/sort/:idUser')
  @ApiOperation({ summary: 'Вывести на страницу новости одного автора' })
  @Render('news-list')
  async getAllSort(@Param('idUser', ParseIntPipe) idUser: number) {
    try {
      const news = await this.newsService.sortAllByUserId(idUser);
      return { news, title: 'Список новостей' }
    } catch (error) {
      return new Error(`err: ${error}`);
    }
  }

  @Get('/:idNews/detail')
  @ApiOperation({ summary: 'Вывод на страниц -  детальная информация новости' })
  @Render('news-id')
  async getNewsWithCommentsView(@Param('idNews', ParseIntPipe) idNews: number) {

    try {
      const news = await this.newsService.findById(idNews)

      if (news === null) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена'
        },
          HttpStatus.NOT_FOUND
        )
      }
      return { news }
    } catch (error) {
      return new Error(`err: ${error}`);
    }
  }

  //@UseGuards(JwtAuthGuard)
  @Get('edit/news/:idNews')
  @ApiOperation({ summary: 'Страница редактирования новости' })
  @Render('edit-news')
  async editNews(@Param('idNews', ParseIntPipe) idNews: number) {
    try {
      const news = await this.newsService.findById(idNews);

      return { news }
    } catch (error) {
      return new Error(`err: ${error}`);
    }
  }

  //@UseGuards(JwtAuthGuard)
  //@Roles(Role.Admin, Role.Moderator)
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
  @ApiBody({ type: CreateNewsDto })
  @ApiCreatedResponse({ description: 'News has been successfully created', type: NewsEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File
  ): Promise<NewsEntity | Error> {
    try {
      if (cover?.filename) {
        news.cover = PATH_NEWS + '/' + cover.filename;
      }
      const newNews = await this.newsService.create(news);
      //await this.mailService.sendNewNewsForAdmin(['bogdanan@tut.by,ledix369@gmail.com'], newNews);
      return newNews
    } catch (error) {
      return new Error(`err: ${error}`);
    }
  }

  //@UseGuards(JwtAuthGuard)
  @Delete('api/:id')
  @ApiResponse({ status: 200, description: 'News has been successfully  deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Remove news' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<string | Error> {
    try {
      const isRemoved = this.newsService.remove(id)
      return isRemoved ? 'Новость удалена!' : "Передан неверный идентификатор, удаление невозможно."
    } catch (error) {
      return new Error(`err: ${error}`);
    }

  }

  //@UseGuards(JwtAuthGuard)
  @Post('api/:id')
  @ApiOperation({ summary: 'Update news' })
  @UseInterceptors(FileInterceptor('cover',
    {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: helperFileLoader.fileFilter
    }),
  )
  @ApiBody({ type: EditNewsDto })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'The record has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Произвести изменения невозможно.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
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


