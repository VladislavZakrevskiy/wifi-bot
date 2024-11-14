import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: [process.env.WEB_APP_URL, 'http://localhost:5173'] });
  await app.listen(3000);
}
bootstrap();
