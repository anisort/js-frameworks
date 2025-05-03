import {ChangeDetectionStrategy, Component, DoCheck} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-task-layout',
  standalone: true,
  templateUrl: './task-layout.component.html',
  styleUrl: './task-layout.component.scss',
  imports: [
    RouterOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskLayoutComponent implements DoCheck {
  ngDoCheck() {
    console.log('[TaskLayoutComponent] CD triggered');
  }

}
