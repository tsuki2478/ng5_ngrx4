import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { ProjectItemComponent } from './project-item/project-item.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { InviteComponent } from './invite/invite.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectRoutingModule } from './project-routing-module';

@NgModule({
  imports: [
    SharedModule,
    ProjectRoutingModule,
  ],
  declarations: [
    ProjectItemComponent,
    NewProjectComponent,
    InviteComponent,
    ProjectListComponent,

  ],
  entryComponents: [
    InviteComponent,
    ProjectListComponent,
  ],

})
export class ProjectModule { }
