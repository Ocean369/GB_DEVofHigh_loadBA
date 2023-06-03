import { Body, Controller, Get, ParseIntPipe, Post, Put, Query, Render, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dtos';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { HelperFileLoader } from '../../../utils/HelperFileLoader';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user-dtos';
import { ApiBody, ApiTags, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersEntity } from './users.entity';

const helperFileLoader = new HelperFileLoader();
const PATH_NEWS = '/news_static';
helperFileLoader.path = PATH_NEWS;

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('api')
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar',
    {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: helperFileLoader.fileFilter
    }),
  )
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: UsersEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(
    @Body() user: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File,): Promise<Object | Error> {
    try {
      if (avatar?.filename) {
        user.avatar = PATH_NEWS + '/' + avatar.filename;
      }
      console.log(user);
      return await this.usersService.create(user);
    } catch (error) {
      return new Error(`err: ${error}`);
    }
  }


  @Get('profile')
  @ApiOperation({ summary: 'Страница профиль пользователя' })
  @ApiResponse({ status: 200, description: 'User profile page loaded', type: UsersEntity })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Render('profile')
  async profileView(
    @Query('idUser', ParseIntPipe) idUser: number,
    @Req() req: Request) {
    try {
      console.log('profile view')
      const user = await this.usersService.findById(idUser);
      return { user }
    } catch (error) {
      return new Error(`err: ${error}`);
    }
  }


  @UseGuards(JwtAuthGuard)
  @Put('api/edit/')
  @ApiOperation({ summary: 'Редактирование данных пользователя' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar',
    {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: helperFileLoader.fileFilter
    }),
  )
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 201, description: 'The record has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Body() user: UpdateUserDto,
    @Req() req,
    @UploadedFile() avatar: Express.Multer.File): Promise<boolean | Error> {
    try {
      const jwtUserId = req.user.userId;
      console.log('userId', jwtUserId)

      if (avatar?.filename) {
        user.avatar = PATH_NEWS + '/' + avatar.filename;
      }
      return await this.usersService.edit(jwtUserId, user);
    } catch (error) {
      return new Error(`err: ${error}`);
    }
  }
}
