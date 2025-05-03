import { UserAPI} from './user.model';

export interface  TaskApi {
  _id: string;
  title: string;
  description?: string;
  assignee: UserAPI;
  dueDate: string;
  status: string;
}

export type  TaskMutationApi = Omit<TaskApi, '_id' | 'assignee'>;

export interface  TaskLoadApi {
  tasks: TaskApi[];
  total: number;
}
