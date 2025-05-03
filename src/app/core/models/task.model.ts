import { TaskStatus } from './status.enum';
import { User } from './user.model';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: User;
  dueDate: string;
  status: TaskStatus;
}

export interface TaskLoad {
  tasks: Task[];
  total: number;
}
