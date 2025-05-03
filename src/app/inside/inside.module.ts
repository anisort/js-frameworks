import { NgModule } from '@angular/core';
import {WorkbenchLayoutComponent} from './components/workbench-layout/workbench-layout.component';
import {TaskLayoutComponent} from './components/task-layout/task-layout.component';
import {TaskListComponent} from './components/task-layout/task-list/task-list.component';
import {TaskItemComponent} from './components/task-layout/task-item/task-item.component';
import {TaskFormComponent} from './components/task-layout/task-form/task-form.component';
import {TaskStatsComponent} from './components/task-layout/task-stats/task-stats.component';
import {StatusFilterPipe} from './pipes/status-filter.pipe';
import {TaskStatusPipe} from './pipes/task-status.pipe';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [
    // components
    WorkbenchLayoutComponent,
    TaskLayoutComponent,
    TaskListComponent,
    TaskItemComponent,
    TaskFormComponent,
    TaskStatsComponent,
    // pipes
    StatusFilterPipe,
    TaskStatusPipe
  ],
  imports: [
    SharedModule,
    RouterModule,
  ]
})
export class InsideModule { }
