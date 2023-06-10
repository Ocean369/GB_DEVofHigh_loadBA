import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { Token } from './request/access-token';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ description: 'User has been successfully authorizated', type: Token })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response): Promise<string> {

    const { access_token, idUser } = await this.authService.login(req.user);
    // Установка куки на 1 час
    const oneHour = 60 * 60 * 1000;
    const expires = new Date(Date.now() + oneHour);
    res.cookie('jwt', access_token, { expires, httpOnly: true });
    res.cookie('idUser', idUser, { expires });
    return access_token
  }

}
