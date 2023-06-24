
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
//import { ChatGateway } from '../src/app/chat/socket-chat.gateway';
import * as socketio from 'socket.io';
import cors from 'cors';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, {
    logger: console,
    cors: true
  }
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', '..', '..', 'public'));

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:4200',
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;


  const server = await app.listen(port);

  console.log('port', port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
