import { NewTaskListComponent } from './../new-task-list/new-task-list.component';
import { NewTaskComponent } from './../new-task/new-task.component';
import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MdDialog } from '@angular/material';
import { CopyTaskComponent } from '../copy-task/copy-task.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../animates/router.anim';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [
    slideToRight
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHomeComponent implements OnInit {
  @HostBinding('@routeAnim') state;

  lists = [
    {
      id: 1, name: '待办',
      tasks: [
        {
          id: 1, desc: '任务一:去星巴克买杯咖啡',
          completed: true,
          priority: 3,
          owner: { id: 1, name: '鱼儿', avatar: 'avatars:svg-11' },
          dueDate: new Date(),
          reminder: Date()
        },
        {
          id: 2, desc: '任务二:300快上线',
          completed: false,
          priority: 2,
          owner: { id: 2, name: '琴里', avatar: 'avatars:svg-12' },
          dueDate: new Date(),
        }
      ]
    },
    {
      id: 2, name: '进行中',
      tasks: [
        {
          id: 3, desc: '任务三:快点上线,来玩lol', completed: false, priority: 1,
          owner: { id: 1, name: 'song', avatar: 'avatars:svg-13' },
          dueDate: new Date(),
        },
        {
          id: 4, desc: '任务四:Angular项目。速度完成。谢谢', completed: false, priority: 2,
          owner: { id: 2, name: '月', avatar: 'avatars:svg-10' },
          dueDate: new Date(),
        }
      ]
    },
  ];

  constructor(private dialog: MdDialog,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  // 打开新任务

  launchNewTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskComponent, { data: { title: '新建任务:' } });
  }

  // 打开移除全部列表

  launchCopyTaskDialog() {
    const dialogRef = this.dialog.open(CopyTaskComponent, { data: { lists: this.lists } });
    console.log('打开移除全部列表');
  }

  // 修改任务
  launchUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, { data: { title: '修改任务:', task: task } });
  }

  // 删除
  launchConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除任务列表', content: '您确认删除该任务列表吗?' } });
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

  // 新增
  launchEditListDialog() {
    const dialogRef = this.dialog.open(NewTaskListComponent, { data: { title: '更改列表名称' } });
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

  launchTaskListDialog() {
    const dialogRef = this.dialog.open(NewTaskListComponent, { data: { title: '新建列表' } });
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

  handleMove(srcData, list) {
    switch (srcData.tag) {
      case 'task-item':
        console.log('handling item');
        console.log(list);
        console.log(srcData);
        for (let i = 0; i < this.lists.length; i++) {
          for (let j = 0; j < this.lists[i].tasks.length; j++) {
            if (this.lists[i].tasks[j].id === srcData.data.id) {
              console.log(this.lists[i].tasks[j]); 
            }
          }
        }
        for (let i = 0; i < this.lists.length; i++) {
          if (this.lists[i].id === list.id) {
            this.lists[i].tasks = this.lists[i].tasks.concat(srcData.data);
          }
        }
        console.log(this.lists);

        break;
      case 'task-list':
        console.log('handling list');
        console.log(list);
        console.log(srcData);
        break;
      default:
        break;
    }
  }

  handleQuickTask(desc :string) {
    console.log(desc);
  }
}
