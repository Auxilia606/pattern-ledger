import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const portFromEnv = configService.get<string>('PORT');
  const port = Number(portFromEnv ?? '8000');

  await app.listen(port, '0.0.0.0');
}
bootstrap();
