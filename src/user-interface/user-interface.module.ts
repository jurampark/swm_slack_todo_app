import { Module } from '@nestjs/common';
import { SlackModule } from '../slack/slack.module';
import { TasksModule } from '../tasks/tasks.module';
import { UserInterfaceService } from './user-interface.service';

@Module({
  imports: [SlackModule, TasksModule],
  providers: [UserInterfaceService],
})
export class UserInterfaceModule {}
