import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
 
@Component({
  selector: 'app-confirm-dialog',
  template: `
  <h2 md-dialog-title> {{title}}</h2>
  <div md-dialog-content class='content'>
       {{content}}
  </div>

  <div md-dialog-actions>
      <button   type="button" md-raised-button color="primary" (click)="onClick(true)"> 确定</button>
      <button  type="button" md-dialog-close md-button (click)="onClick(false)">取消</button>
  </div>
  `,
  styles: [`
 .content{
  padding-bottom: 20px;
 };
  `],
 
})
export class ConfirmDialogComponent implements OnInit {
  title = '';
  content = '';
  // 实例化是为了不在此处做逻辑
  constructor(
    private dialogRef: MdDialogRef<ConfirmDialogComponent>,
    @Inject(MD_DIALOG_DATA) private data
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.content = this.data.content;
  }
  onClick(result: boolean) {
    this.dialogRef.close(result);
    // 将参数发射出去。
  }

}
