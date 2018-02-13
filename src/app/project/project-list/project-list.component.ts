import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { InviteComponent } from '../invite/invite.component';
import { listAnimation } from '../../animates/list.anim';
import { MdDialog, MdDialogRef } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { Project } from '../../domain/index';
import { ProjectService } from '../../services/project.service';
import { slideToRight } from '../../animates/router.anim';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight, listAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding('@routeAnim') state;

  projects;
  sub: Subscription;
  // projects = [
  //   {
  //     'id': 1,
  //     'name': '学姐',
  //     'desc': '骑士少女',
  //     'coverImg': '/assets/covers/cover (1).jpg'
  //   },

  //   {
  //     'id': 2,
  //     'name': '学姐',
  //     'desc': '不明',
  //     'coverImg': '/assets/covers/cover (2).jpg'
  //   }
  // ];
  constructor(
    public dialog: MdDialog,
    private cd: ChangeDetectorRef,
    private service$: ProjectService,
  ) { }

  ngOnInit() {
    this.sub = this.service$.get('1').subscribe(project => {
      this.projects = project;
      this.cd.markForCheck();
      console.log(project);
    });
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  // 添加新项目。对话框
  openNewProjectDialog() {
    const selectedImg = `/assets/covers/${Math.floor(Math.random() * 50)}_tn.png`;
    console.log(selectedImg);
    const dialogRef = this.dialog.open(
      NewProjectComponent, { data: { thumbnails: this.getThumbnails(), img: selectedImg } });
    dialogRef.afterClosed()
      // 只取一次 .. 可以当做取消订阅
      .take(1)
      .filter(n => n) // 保证有数
      .map(val => ({ ...val, coverImg: this.buildImgSrc(val.coverImg) }))
      .switchMap(v => this.service$.add(v))
      .subscribe(project => {
        this.projects = [...this.projects, project];
        this.cd.markForCheck();
      });
    //    result => {
    //   console.log(result);
    //   if (result === true) {
    //     this.projects = [... this.projects, { id: 3, name: '一个新项目', desc: '这是一个新项目', coverImg: '/assets/covers/cover (4).jpg' }],
    //       this.projects = [... this.projects, { id: 4, name: '又一个新项目', desc: '这是一个新项目', coverImg: '/assets/covers/cover (5).jpg' }];
    //     // afterClosed是RX的观察对象
    //     //  ... this.projects是添加一个新元素,生成新的数组
    //     this.cd.markForCheck();
    //   } else {
    //     console.log('关闭');
    //   }
    // }
  }

  //  自动完成
  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent, { data: { members: [] } });
  }

  //  编辑
  launchUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(
      NewProjectComponent, { data: { thumbnails: this.getThumbnails(), project: project } });
    dialogRef.afterClosed()
      // 只取一次 .. 可以当做取消订阅
      .take(1)
      .filter(n => n) // 保证有数
      .map(val => ({ ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) }))
      .switchMap(v => this.service$.update(v))
      .subscribe(project => {
        const index = this.projects.map(p => p.id).indexOf(project.id);
        this.projects = [...this.projects.slice(0, index), project, ...this.projects.slice(index, +1)];
        this.cd.markForCheck();
      });
    // const dialogRef = this.dialog.open(NewProjectComponent, { data: { title: '编辑:' } });
  }

  // 删除
  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除', content: '您确认删除?' } });
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .switchMap(_ => this.service$.del(project))
      .subscribe(result => {
        console.log(result);
        this.projects = this.projects.filter(p => p.id !== result.id);
        //  filter是数组的方法， 返回新的数组
        this.cd.markForCheck();
      });
  }

  private getThumbnails() {
    return _.range(0, 50)
      .map(i => `/assets/covers/${i}_tn.png`);
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }
}
