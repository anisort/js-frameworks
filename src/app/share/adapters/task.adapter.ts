import {TaskApi, TaskLoadApi} from '../../core/models/task-api.model';
import {Task, TaskLoad} from '../../core/models/task.model';
import {TaskStatus} from '../../core/models/status.enum';

export class TaskAdapter {
  static fromAPI(response: TaskApi): Task {
    return {
      id: response._id,
      title: response.title,
      description: response.description || '',
      assignee: response.assignee,
      dueDate: response.dueDate?.split('T')[0],
      status: response.status as TaskStatus
    }
  }
  static fromLoadAPI(response: TaskLoadApi): TaskLoad {
    return {
      tasks: response.tasks.map(task => TaskAdapter.fromAPI(task)),
      total: response.total
    }
  }
  static toAPI(task: Task): Omit<TaskApi, '_id'> {
    return {
      title: task.title,
      description: task.description || '',
      assignee: task.assignee,
      dueDate: new Date(task.dueDate).toISOString(),
      status: task.status
    }
  }
  static toPartialApi(partialTask: Partial<Task>): Partial<Task> {
    const apiTask: Partial<Task> = {};
    if (partialTask.dueDate) {
      apiTask.dueDate = new Date(partialTask.dueDate).toISOString();
    }
    if (partialTask.status) {
      apiTask.status = partialTask.status;
    }
    return apiTask;
  }
}
