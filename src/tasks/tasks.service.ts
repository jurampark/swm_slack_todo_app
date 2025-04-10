import { Injectable } from '@nestjs/common';
import { Tasks } from './tasks.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async createTask(title: string): Promise<Tasks> {
    return this.tasksRepository.createTask(title);
  }

  async getAllTasks(): Promise<Tasks[]> {
    return this.tasksRepository.find();
  }
}
