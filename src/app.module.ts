import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlackModule } from './slack/slack.module';
import { Tasks } from './tasks/tasks.entity';
import { TasksModule } from './tasks/tasks.module';
import { UserInterfaceModule } from './user-interface/user-interface.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'jurampark',
      password: 'postgres',
      database: 'postgres',
      entities: [Tasks],
      synchronize: true,
    }),
    UserInterfaceModule,
    SlackModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
