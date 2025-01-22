import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  GenericExceptionFilter,
  validationExceptionHandler,
} from './common/exceptions/handlers';
import { DevInterceptor } from './common/exceptions/interceptors';
import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('CORS_ORIGIN')
      ? configService.get('CORS_ORIGIN').split(',')
      : [],
  });

  const config = new DocumentBuilder()
    .setTitle('diogenes')
    .setDescription('')
    .setVersion(configService.get('VERSION') || '0.0.0')
    .addTag('app')
    .addBasicAuth()
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/swagger.json',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionHandler,
    }),
  );
  app.useGlobalFilters(new GenericExceptionFilter());
  if (configService.get('NODE_ENV') === 'DEV') {
    app.useGlobalInterceptors(new DevInterceptor());
  }

  const bot = app.get(getBotToken());
  app.use(bot.webhookCallback(configService.get('TELEGRAM_WEBHOOK_PATH')));

  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
