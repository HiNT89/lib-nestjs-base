import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import APP_CONFIG from '../config/app.config';

export default function initSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(APP_CONFIG.TITLE)
    .setDescription(APP_CONFIG.DESCRIPTION)
    .setVersion(APP_CONFIG.VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(APP_CONFIG.END_POINT, app, document);
}
