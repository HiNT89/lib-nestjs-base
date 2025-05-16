import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import APP_CONFIG from '@/common/AppConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Đặt prefix version cho toàn bộ API
  app.setGlobalPrefix(APP_CONFIG.VERSION_API);
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle(APP_CONFIG.TITLE)
    .setDescription(APP_CONFIG.DESCRIPTION)
    .setVersion(APP_CONFIG.VERSION)
    .addBearerAuth() // Nếu dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(APP_CONFIG.END_POINT, app, document); // http://localhost:3000/api/docs

  await app.listen(APP_CONFIG.PORT);
}
bootstrap();
