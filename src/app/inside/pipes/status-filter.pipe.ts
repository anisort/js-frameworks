import { Pipe, PipeTransform } from '@angular/core';
import {TaskStatus} from '../../share/core/models/status.enum';
import {Task} from '../../share/core/models/task.model';

@Pipe({
  name: 'statusFilter',
  pure: false,
  standalone: false
})
export class StatusFilterPipe implements PipeTransform {

  transform(tasks: Task[], status: TaskStatus | 'all') : Task[]{
    if (!tasks){
      return [];
    }

    if(status === 'all' || status === null || status === undefined){
      return tasks;
    }

    return tasks.filter(task=>task.status === status);

  }

}
