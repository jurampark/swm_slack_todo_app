import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { App, BlockAction, ViewSubmitAction } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class UserInterfaceService implements OnModuleInit {
  constructor(
    @Inject('SLACK_APP') private readonly slackApp: App,
    private readonly tasksService: TasksService,
  ) {}

  onModuleInit() {
    console.log('onModuleInit');
    this.register();
  }

  private async refreshHomeTab(client: WebClient, userId: string) {
    const tasks = await this.tasksService.getAllTasks();

    await client.views.publish({
      user_id: userId,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'new tasks',
                  emoji: true,
                },
                value: 'new_task',
                action_id: 'new_task_button',
              },
            ],
          },
          {
            type: 'section',
            block_id: 'todo_checkboxes',
            text: {
              type: 'mrkdwn',
              text: '*Your To-Do List:*',
            },
            accessory: {
              type: 'checkboxes',
              action_id: 'task_selection',
              options: tasks.map((task) => ({
                text: {
                  type: 'plain_text',
                  text: task.title,
                  emoji: true,
                },
                value: `task_${task.id}`,
              })),
            },
          },
        ],
      },
    });
  }

  register() {
    // Register home tab view
    this.slackApp.event('app_home_opened', async ({ event, client }) => {
      await this.refreshHomeTab(client, event.user);
    });

    // Register new task button click handler
    this.slackApp.action<BlockAction>(
      'new_task_button',
      async ({ ack, body, client }) => {
        await ack();

        try {
          if (!body.trigger_id) {
            throw new Error('No trigger_id found in request body');
          }

          await client.views.open({
            trigger_id: body.trigger_id,
            view: {
              type: 'modal',
              callback_id: 'new_task_modal',
              title: {
                type: 'plain_text',
                text: 'Create New Task',
                emoji: true,
              },
              submit: {
                type: 'plain_text',
                text: 'Create',
                emoji: true,
              },
              close: {
                type: 'plain_text',
                text: 'Cancel',
                emoji: true,
              },
              blocks: [
                {
                  type: 'input',
                  block_id: 'task_title_block',
                  element: {
                    type: 'plain_text_input',
                    action_id: 'task_title_input',
                    placeholder: {
                      type: 'plain_text',
                      text: 'Enter task title',
                    },
                  },
                  label: {
                    type: 'plain_text',
                    text: 'Task Title',
                    emoji: true,
                  },
                },
              ],
            },
          });
        } catch (error) {
          console.error('Error opening modal:', error);
        }
      },
    );

    // Register modal submission handler
    this.slackApp.view<ViewSubmitAction>(
      'new_task_modal',
      async ({ ack, body, view, client }) => {
        await ack();

        try {
          const title =
            view.state.values.task_title_block.task_title_input.value;
          if (!title) {
            throw new Error('No task title provided');
          }

          await this.tasksService.createTask(title);

          // Refresh the home tab to show the new task
          await this.refreshHomeTab(client, body.user.id);
        } catch (error) {
          console.error('Error creating task:', error);
        }
      },
    );
  }
}
