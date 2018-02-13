import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { User } from './../../domain/user.model';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class InviteComponent implements OnInit {
  // items = [
  //   {
  //     id: 1,
  //     name: '月',
  //   },
  //   {
  //     id: 2,
  //     name: '鱼儿',
  //   },
  //   {
  //     id: 3,
  //     name: '琴里',
  //   },
  //   {
  //     id: 4,
  //     name: '空',
  //   },
  // ];
  // 提供给md-opton的集合。

  members: User[] = [];
  constructor(
    @Inject(MD_DIALOG_DATA) private data,
    private dialogRef: MdDialogRef<InviteComponent>
  ) { }

  ngOnInit() {
    this.members = [...this.data.members];
  }

  onSubmit(ev: Event, { valid, value }) {
    ev.preventDefault();
    console.log(valid);
    console.log(value);
    if (!valid) {
      return;
    }
    this.dialogRef.close(this.members);
  }
  // void返回， 选中后返回
  // displayUser(user: { id: string; name: string }) {
  //   return user ? user.name : 'null';
  // }

}
