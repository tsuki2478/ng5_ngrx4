import { TaskList } from './../../domain/task-list.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-new-task-list',
  templateUrl: './new-task-list.component.html',
  styleUrls: ['./new-task-list.component.scss']
})
export class NewTaskListComponent implements OnInit {
  form: FormGroup;
  title = '';

  constructor(
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) private data,
    private dialogRef: MdDialogRef<NewTaskListComponent>,
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.form = this.fb.group({
      name: [this.data.taskList ? this.data.taskList : '', Validators.required]
    });
  }

  onSubmit({ value, valid }) {
    if (!valid) {
      return;
    }
    // this.dialogRef.close(this.form.value.name);
    this.dialogRef.close(value);
    console.log('点击进入项目..');
  }

}
