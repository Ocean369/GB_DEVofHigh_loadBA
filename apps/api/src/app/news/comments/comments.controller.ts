import { Body, Controller, Param, Post, Get, Delete, Put, Res, Render, ParseIntPipe, UseGuards, Req, Query, HttpException, HttpStatus, ForbiddenException, } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Request, Response } from 'express'
import { EditCommentDto } from './dtos/edit-comments-dtos';
import { CreateCommentDto } from './dtos/create-comments-dtos';
import { HelperFileLoader } from '../../../../utils/HelperFileLoader';
import { NewsService } from '../news.service';
import { CommentsEntity } from './comments.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/role/roles.decorator';
import { Role } from '../../auth/role/role.enum';
import { ApiBody, ApiTags, ApiBearerAuth, ApiResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiFoundResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';

const helperFileLoader = new HelperFileLoader();
const PATH_NEWS = '/news_static';
helperFileLoader.path = PATH_NEWS;

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService,
    private readonly newsService: NewsService,

  ) { }

  @Get('create/comment/:idNews/:idComm?')
  @Render('create-comments')
  @ApiOperation({ summary: 'Страница создания комментария' })
  async createComment(
    @Param('idNews') idNews: string,
    @Param('idComm') idComm: string) {
    if (idComm) return { idNews: idNews, idComm: idComm }
    else return { idNews: idNews }
  }

  @Get('edit/comment/:idNews/:idComm')
  @Render('edit-comment')
  @ApiOperation({ summary: 'Страница редактирования комментария' })
  async editComment(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Param('idComm', ParseIntPipe) idComm: number,
  ) {
    const comment = await this.commentsService.findById(idComm)
    return { idNews: idNews, comment }
  }


  @Post('/api/:idNews')
  @ApiOperation({ summary: 'Создание комментария' })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateCommentDto, description: 'Create comment for news', })
  @ApiCreatedResponse({ description: 'Comment has been successfully created', type: CommentsEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() comment: CreateCommentDto,
    @Req() req,
  ): Promise<CommentsEntity | Error> {
    try {

      const jwtUserId = await req.user.userId;
      // console.log('jwtUserId', jwtUserId);
      const newComment = await this.commentsService.create(idNews, comment.message, jwtUserId);
      return newComment
    } catch (error) {
      throw new ForbiddenException('Forbidden.');
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Получить все комментарии новости' })
  @ApiFoundResponse({ description: 'All comments', type: [CommentsEntity] })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async get(@Query('idNews', ParseIntPipe) idNews: number) {
    const news = await this.newsService.findById(idNews);
    const comments = await this.commentsService.findAll(idNews)
    return comments
  }


  @UseGuards(JwtAuthGuard)
  @Delete('api/:idComm')
  @ApiOperation({ summary: 'Удаление комментария' })
  @Roles(Role.User, Role.Admin)
  @ApiResponse({ status: 200, description: 'Comment has been successfully  deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async remove(
    @Param('idComm', ParseIntPipe) idComm: number,
    @Req() req
  ): Promise<string | Error> {
    try {
      console.log('request user', req.user);
      const jwtUserId = req.user.userId;
      console.log('type of jwtUserId', typeof jwtUserId);
      const jwtUserRole = await req.user.userRoles;
      console.log('user role', jwtUserRole);
      const _comment = await this.commentsService.findById(idComm);

      if (!_comment) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Передан неверный идентификатор, удаление невозможно.'
        },
          HttpStatus.NOT_FOUND
        )
      }
      const commentIdUser = _comment.user.id;
      console.log('commentIdUser and type', commentIdUser, typeof commentIdUser);
      if ((jwtUserRole === 'user' && commentIdUser === jwtUserId) || jwtUserRole === 'admin') {
        const resultRemoving = await this.commentsService.remove(idComm)
        return 'Комментарий удален!'
      }
      return 'Удаление невозможно'
    } catch (error) {
      throw new Error(`err: ${error}`);
    }
  }


  @UseGuards(JwtAuthGuard)
  @Put('api/:idComm')
  @ApiOperation({ summary: 'Редактирование комментария' })
  @ApiBody({ type: EditCommentDto })
  @ApiResponse({ status: 201, description: 'The record has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Передан неверный идентификатор. Комментарий не найден' })
  async update(
    @Param('idComm', ParseIntPipe) idComm: number,
    @Body() message: EditCommentDto,
    @Res() response: Response,
    @Req() req) {
    try {
      const _comment = await this.commentsService.findById(idComm);
      const jwtUserId = await req.user.userId;
      console.log('jwtUserId', jwtUserId);
      console.log('message', message.message, typeof message.message);
      if (!_comment) {
        response.status(404).end('Передан неверный идентификатор. Комментарий не найден')
      } else {
        const result = await this.commentsService.update(idComm, message.message);
        if (result instanceof Error) {
          response.status(500).end(result.message)
        }
        result
          ? response.status(200).end('Комментарий успешно изменен')
          : response.status(400).end('Произвести изменения невозможно.')
      }

    } catch (error) {
      return new Error(`err: ${error}`);
    }
  }


}

