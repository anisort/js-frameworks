import {Task} from '../models/task.model';
import {TaskStatus} from '../models/status.enum';

export const tasks: Task[] = [
  {
    id: 0,
    title: 'Complete lab1',
    assignee: 'Valeriia',
    dueDate: '17.02.2025',
    status: TaskStatus.IN_PROGRESS
  },
  {
    id: 1,
    title: 'Complete lab2',
    description: 'Read the lecture and methodological instructions, and according to them complete lab2',
    assignee: 'Valeriia',
    dueDate: '24.02.2025',
    status: TaskStatus.IN_PROGRESS
  },
  {
    id: 2,
    title: 'Complete lab3',
    description: 'Read the lecture and methodological instructions, and according to them complete lab3',
    assignee: 'Valeriia',
    dueDate: '01.03.2025',
    status: TaskStatus.TODO
  },
];
