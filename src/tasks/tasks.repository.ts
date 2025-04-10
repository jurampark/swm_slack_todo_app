import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Tasks } from './tasks.entity';

@Injectable()
export class TasksRepository extends Repository<Tasks> {
  constructor(private dataSource: DataSource) {
    super(Tasks, dataSource.createEntityManager());
  }

  async createTask(title: string): Promise<Tasks> {
    const task = this.create({
      title,
      isDone: false,
    });

    return this.save(task);
  }
}
