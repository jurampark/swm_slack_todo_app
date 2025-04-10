import { Module } from '@nestjs/common';
import { slackAppProvider } from '../slack.provider';

@Module({
  providers: [slackAppProvider],
  exports: [slackAppProvider],
})
export class SlackModule {}
