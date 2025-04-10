import { Provider } from '@nestjs/common';
import { App, ExpressReceiver } from '@slack/bolt';
import * as express from 'express';

import 'dotenv/config';

const slackAppReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: slackAppReceiver,
});

export const slackAppProvider: Provider = {
  provide: 'SLACK_APP',
  useValue: slackApp,
};

export const expressServer = express();
slackAppReceiver.app.use(expressServer);

async function bootstrap() {
  await slackApp.start(process.env.PORT ?? 3000);
}

bootstrap();
