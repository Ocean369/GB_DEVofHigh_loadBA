/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as expressHbs from 'express-handlebars';
import * as hbs from 'hbs';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, {
    logger: ['debug', 'verbose', 'error', 'warn', 'log'],
    cors: true
  }
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', '..', '..', 'public'));
  //app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.engine(
  //   'hbs',
  //   expressHbs({
  //     layoutsDir: join(__dirname, '..', 'views/layouts'),
  //     defaultLayout: 'layout',
  //     extname: 'hbs',
  //   }),
  // );
  //hbs.registerPartials(__dirname + '/views/partials');
  //app.setViewEngine('hbs');
  app.use(cookieParser());

  // const config = new DocumentBuilder()
  //   .setTitle('News blog`s API')
  //   .setDescription('The news API description  - all interaction methods')
  //   .setVersion('1.0')
  //   .addTag('news, users, comments')
  //   .addBearerAuth()
  //   .build();

  //const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('api', app, document);

  app.enableCors();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log('port', port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
