import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHeaderComponent implements OnInit {

  @Input() header = '';
  @Output() newTask = new EventEmitter<void>();
  @Output() moveAll = new EventEmitter<void>();
  @Output() deleteList = new EventEmitter<void>();
  @Output() EditList = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  // 传命令过去
  onNewTaskClick() {
    this.newTask.emit();
  }

  // 移除列表,点击事件
  onMoveALLClick() {
    this.moveAll.emit();
  }

  // 删除
  onDelListClick() {
    this.deleteList.emit();
  }
  // 修改
  onEditListClick() {
    this.EditList.emit();
  }
}
