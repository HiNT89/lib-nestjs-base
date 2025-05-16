import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import APP_CONFIG from './config/app.config';
import initSwagger from './swagger/swagger';
import { LoggingInterceptor } from '@/interceptor/logger.interceptor';
import { TransformInterceptor } from '@/interceptor/transform.interceptor';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(bodyParser.json({ limit: APP_CONFIG.MAX_FILE_SIZE }));
  app.use(
    bodyParser.urlencoded({ limit: APP_CONFIG.MAX_FILE_SIZE, extended: true }),
  );
  app.use(cookieParser());

  app.setGlobalPrefix(APP_CONFIG.VERSION_API);

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    credentials: true,
    origin: true,
  });

  initSwagger(app);

  await app.listen(APP_CONFIG.PORT);
  console.log(
    `🚀 Server is running at http://localhost:${APP_CONFIG.PORT}/${APP_CONFIG.VERSION_API}`,
  );
}
bootstrap();
