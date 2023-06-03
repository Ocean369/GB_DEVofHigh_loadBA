import { Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('home page, sign In/Up')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Домашняя страница' })
  @Render('home')
  async home() {
    return {}
  }

  @Get('signin')
  @ApiOperation({ summary: 'Страница login' })
  @Render('sign-in')
  async signIn() {
    return {}
  }

  @Get('signup')
  @ApiOperation({ summary: 'Страница регистрации' })
  @Render('registration')
  async signUp() {
    return {}
  }

}

