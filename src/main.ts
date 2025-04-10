import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app.module';

import 'dotenv/config';
import { expressServer } from './slack.provider';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressServer),
  );
  await app.listen(process.env.PORT ?? 3001);
  // await slackApp.start(process.env.PORT ?? 3000);
}

bootstrap();
