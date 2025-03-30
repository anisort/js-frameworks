import {Task} from '../models/task.model';
import {TaskStatus} from '../models/status.enum';

export const tasks: Task[] = [
  {
    id: "0",
    title: 'Complete lab1',
    assignee: 'Valeriia',
    dueDate: '2025-02-17',
    status: TaskStatus.DONE
  },
  {
    id: "1",
    title: 'Complete lab2',
    description: 'Read the lecture and methodological instructions, and according to them complete lab2',
    assignee: 'Valeriia',
    dueDate: '2025-02-24',
    status: TaskStatus.IN_PROGRESS
  },
  {
    id: "2",
    title: 'Complete lab3',
    description: 'Read the lecture and methodological instructions, and according to them complete lab3',
    assignee: 'Valeriia',
    dueDate: '2025-03-01',
    status: TaskStatus.TODO
  },
];
