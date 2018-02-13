import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Component, OnInit, Inject , ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-copy-task',
  templateUrl: './copy-task.component.html',
  styleUrls: ['./copy-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CopyTaskComponent implements OnInit {


  lists: any[];

  constructor(
    // 接受 home页面传过来的命令和数据。
    @Inject(MD_DIALOG_DATA) private data,
    //  调用后返回
    private dialogRef: MdDialogRef<CopyTaskComponent>,
  ) { }

  ngOnInit() {
    this.lists = this.data.lists;
  }
  onClick() {
  }
}
