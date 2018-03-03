import { DeleteAction } from './../../actions/project.action';
import { Observable } from 'rxjs/Observable';
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

import { Action, Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as  actions from '../../actions/project.action';
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

  projects$: Observable<Project[]>;
  listAnim$: Observable<number>;
  // sub: Subscription;
  constructor(
    public dialog: MdDialog,
    // private cd: ChangeDetectorRef,
    private store$: Store<fromRoot.State>
  ) {
    // ngrx模块
    this.store$.dispatch(new actions.LoadAction(null));
    this.projects$ = this.store$.select(fromRoot.getProjects);
    this.listAnim$ = this.projects$.map(p => p.length);
    // console.log(this.listAnim$);
  }

  ngOnInit() {
    // this.sub = this.service$.get('1').subscribe(project => {
    //   this.projects = project;
    //   this.cd.markForCheck();
    //   console.log(project);
    // });
  }
  ngOnDestroy() {
    // if (this.sub) {
    //   this.sub.unsubscribe();
    // }
    this.projects$ = null;
    this.listAnim$ = null;
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
      .subscribe(project => {
        this.store$.dispatch(new actions.AddAction(project));
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
    // this.store$.select(fromRoot.getProjects(project.id))
    // .take(1)
    // .map(members => this.dialog.open(InviteComponent, {data: { members: members}}))
    // .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter(n => n))
    // .subscribe(val => {
    //   this.store$.dispatch(new actions.InviteAction({projectId: <string>project.id, members: <User[]>val}));
    // });
  }

  //  编辑
  launchUpdateDialog(project: Project) {
    const thumbnails$ = this.getThumbnails();
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { project: project, thumbnails: thumbnails$ } });
    dialogRef.afterClosed().
      take(1)
      .subscribe(val => {
        if (val) {
          const converImg = this.buildImgSrc(val.coverImg);
          this.store$.dispatch(new actions.UpdateAction({ ...val, id: project.id, coverImg: converImg }));
        }
      });

    // const dialogRef = this.dialog.open( NewProjectComponent, { data: { thumbnails: this.getThumbnails(), project: project } });
    // dialogRef.afterClosed()
    //   // 只取一次 .. 可以当做取消订阅
    //   .take(1)
    //   .filter(n => n) // 保证有数
    //   .map(val => ({ ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) }))
    //   .subscribe( project => {
    //     this.store$.dispatch(new actions.UpdateAction(project));
    //   });
  }

  // 删除
  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { data: { title: '删除', content: '您确认删除?' } });
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .subscribe(val => {
        this.store$.dispatch(new actions.DeleteAction(project));
      });
  }

  selectProject(project: Project) {
    console.log(project);
    this.store$.dispatch(new actions.SelectAction(project));
  }

  private getThumbnails() {
    return _.range(0, 50)
      .map(i => `/assets/covers/${i}_tn.png`);
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }

  getOutID(i){
    console.log('1111111111111')
    console.log(i);
  }
}
