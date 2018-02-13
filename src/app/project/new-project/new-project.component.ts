import { group } from '@angular/animations';
import { Project } from './../../domain/project.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class NewProjectComponent implements OnInit {
  title = '';
  coverImages = [];
  form: FormGroup;
  constructor(
    @Inject(MD_DIALOG_DATA) private data,
    private dialogRef: MdDialogRef<NewProjectComponent>,
    private fb: FormBuilder,
  ) { }

  //   private oc: OverlayContainer; 为了支持主题
  ngOnInit() {
    this.coverImages = this.data.thumbnails;
    console.log(this.coverImages);
    if (this.data.project) {
      this.form = this.fb.group({
        name: [this.data.project.name, Validators.required],
        desc: [this.data.project.desc],
        coverImg: [this.data.project.coverImg]
      });
      this.title = '修改项目:';
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        desc: [],
        coverImg: [this.data]
      });
    }
    this.title = '创建项目:';
    // this.title = this.data.title;
    // console.log(JSON.stringify(this.data));
  }
  // onClick(result: boolean) {
  //   this.dialogRef.close(result);
  // }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close(value);
  }
}
