import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ZodValidationPipe());
  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });
  const port = process.env.API_PORT ?? process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
