import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Reflector } from '@nestjs/core'; // Chú ý import đúng từ @nestjs/core
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

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(
    new LoggingInterceptor(), // ghi log lại các request/response
    new TransformInterceptor(reflector), // định dạng lại dữ liệu trả về theo chuẩn nhất
  );
  // chống injection và đảm bảo dữ liệu đúng định dạng trước khi vào controller.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // chỉ cho phép các trường đã được định nghĩa trong DTO
      forbidNonWhitelisted: true, // trả về lỗi nếu có trường không được định nghĩa trong DTO
      transform: true, // tự động chuyển đổi kiểu dữ liệu DTO
      transformOptions: {
        enableImplicitConversion: true, // tự động đoán kiểu dữ liệu để convert
      },
    }),
  );

  app.enableCors({
    credentials: true, //Cho phép gửi cookie, token qua CORS request.
    origin: true, //  Chấp nhận mọi domain gửi request
  });

  initSwagger(app);

  await app.listen(APP_CONFIG.PORT);
  console.log(
    `🚀 Server is running at http://localhost:${APP_CONFIG.PORT}/${APP_CONFIG.VERSION_API}`,
  );
}
bootstrap();
