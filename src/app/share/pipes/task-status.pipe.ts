import { Pipe, PipeTransform } from '@angular/core';
import {TaskStatus} from '../../core/models/status.enum';

@Pipe({
  name: 'taskStatus',
  standalone: false
})
export class TaskStatusPipe implements PipeTransform {

  transform(status: TaskStatus): string {
    const statusMap: { [key in TaskStatus]: string} = {
      [TaskStatus.TODO]: 'To do',
      [TaskStatus.IN_PROGRESS]: 'In progress',
      [TaskStatus.DONE]: 'Done'
    };
    return statusMap[status] || 'Unknown status';
  }

}
